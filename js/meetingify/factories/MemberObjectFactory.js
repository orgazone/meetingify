/**
 * Created by Relvin Gonzalez on 8/20/2015
 * Creates Agenda Objects for use on any other factory
 *
 */
meetingifyApp.factory('MemberObjectFactory',['ApiCallService','$q' ,function(ApiCallService,$q){
//-------------------------------------------------
//  meetingId : meeting Id
//  memberLocalId  : member ID stored on localStorage
//  memberUniqueId   :  member ID on Cloud
//-------------------------------------------------


    var MemberObject = function(email, fullname, confirmed, meetingId, memberLocalId, memberUniqueId,invited,tag){
        if(arguments.length == 2){
            this.init(email, fullname);
        }
        else{
            this.email = email;
            this.fullname = fullname;
            this.confirmed = confirmed;
            this.meetingId = meetingId;
            this.memberLocalId = typeof memberLocalId!== 'undefined' ? memberLocalId : 0;
            this.memberUniqueId = typeof memberUniqueId !== 'undefined' ? memberUniqueId : 0;
            this.tag = typeof tag !== 'undefined' ? tag: "";
            this.invited = typeof invited !== 'undefined' ? invited: "no";
        }

    }


    MemberObject.prototype.init = function(memberId, localDb){
        var self = this;
        localDb.queryAll ("members", {
            query: function(row) {
                if(row.ID == memberId) {
                    self.memberLocalId = memberId;
                    self.email = row.user_email;
                    self.fullname = row.fullname;
                    self.confirmed = row.confirmed;
                    self.meetingId = row.meetingid;
                    self.memberUniqueId = row.userid;
                    self.invited = row.invited;
                    self.tag = row.tag;
                }
            }
        });
    }

    MemberObject.prototype.insertToLocalStorage = function (localDb){
        var memberId = localDb.insert("members", {
            meetingid:this.meetingId,
            userid: this.memberUniqueId,
            user_email: this.email,
            fullname: this.fullname,
            confirmed: this.confirmed,
            invited: this.invited,
            tag: this.tag
        });

        this.memberLocalId = memberId;
        var self = this;

        localDb.update(
            "meetings",
            { meetingid: this.meetingId },
            function(row){
                row.members_count = row.members_count+1;
                if((row.status=="published"||row.status=="pending") && self.tag!="old")
                    row.status="edited";
                return row;
            }
        );
        //use local id as user id for new members before uploading to cloud.
        localDb.update(
            "members",
            { ID: this.memberLocalId },
            function (row) {
                row.userid = self.memberLocalId;
                return row;
            });
        localDb.commit();
    }

    MemberObject.prototype.updateToLocalStorage = function (localDb,invitation){
        var self = this;
        localDb.update(
            "members",
            { ID: this.memberLocalId },
            function (row) {
                row.userid = self.memberUniqueId;
                row.user_email = self.email;
                row.meetingid = self.meetingId;
                row.fullname = self.fullname;
                row.confirmed = self.confirmed;
                row.invited = self.invited;
                row.tag = self.tag;
                return row;
            }
        );
        if(!invitation) {
            localDb.update(
                "meetings",
                {meetingid: this.meetingId},
                function (row) {
                    if ((row.status == "published" || row.status == "pending") && self.tag != "old")
                        row.status = "edited";
                    return row;
                }
            );
        }
        localDb.commit();
    }

    MemberObject.prototype.updateToCloud = function (localDb,invitation) {
        var memberdata = {};
        var self = this;
        memberdata.OZINDEX = this.memberUniqueId;
        memberdata.meetingid =this.meetingId;
        memberdata.userid = this.memberUniqueId;
        memberdata.email = this.email;
        memberdata.fullname = this.fullname;
        memberdata.confirmed = this.confirmed;
        memberdata.invited = this.invited;
        memberdata.tag = this.tag;

        return ApiCallService.apiCall (
            "update",
            "meetingify",
            "members",
            this.meetingId,
            memberdata)
            .then(function (data) {
                self.updateToLocalStorage(localDb,invitation);
            });
    }

    MemberObject.prototype.insertToCloud = function (localDb){
        var memberdata = {};
        var self = this;
        memberdata.meetingid =this.meetingId;
        //check userid
        memberdata.userid = this.memberUniqueId;
        memberdata.email = this.email;
        memberdata.fullname = this.fullname;
        memberdata.confirmed = this.confirmed;
        memberdata.invited = this.invited;
        memberdata.tag = this.tag;

        return ApiCallService.apiCall(
            "push",
            "meetingify",
            "members",
            this.meetingId,
            memberdata)
            .then(function(data) {
                self.memberUniqueId = data.data.data.LASTID;

                //update the todos with the new unique member id returned from cloud
                localDb.update(
                    "todos",
                    {user_id: self.memberLocalId},
                    function(row){
                        row.user_id = self.memberUniqueId;
                        return row;
                    }
                );
                //update the agendas with the actual owner_id once the member has been added to cloud
                localDb.update(
                    "agenda",
                    {owner_id: self.memberLocalId},
                    function(row){
                        row.owner_id = self.memberUniqueId;
                        return row;
                    }
                );
                localDb.commit();

                return self.updateToCloud(localDb);
             });
    }

    MemberObject.prototype.removeFromLocalStorage = function (localDb){
        localDb.deleteRows(
            "members",
            {ID:this.memberLocalId}
        );
        localDb.commit();
    }

     MemberObject.prototype.removeFromCloud = function (localDb){
        var memberdata = this.memberUniqueId;
        var self = this;
        return  ApiCallService.apiCall(
            "delete",
            "meetingify",
            "",
            -1,
            this.memberUniqueId)
            .then(function(data) {
                self.removeFromLocalStorage(localDb);
            });
    }

    return MemberObject;

}])
