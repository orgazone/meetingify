/**
 * Created by Relvin Gonzalez on 8/20/2015
 * Creates Agenda Objects for use on any other factory
 *
 */
meetingifyApp.factory('AgendaObjectFactory',['ApiCallService','$q' ,function(ApiCallService,$q){
    //
//  agendaContent: agenda Content
//  meetingId : meeting Id
//  userId  : user ID of meeting creator
//  agendaLocalId   :  ID of an agenda on localstorage
//  agendaUniqueId: ID of an agenda on cloud


    var agenda = function(agendaContent, meetingId, userId, agendaLocalId, agendaUniqueId, tag, ownerId,startTime,endTime){
        if(arguments.length == 2){
            this.init(agendaContent, meetingId);
        }
        else{
            this.agendaContent = agendaContent;
            this.meetingId = meetingId;
            this.userId = userId;
            this.agendaLocalId = typeof agendaLocalId!== 'undefined' ? agendaLocalId : 0;
            this.agendaUniqueId = typeof agendaUniqueId !== 'undefined' ? agendaUniqueId : 0;
            this.tag = typeof tag !== 'undefined' ? tag : "";
            this.ownerId = typeof ownerId !== 'undefined' ? ownerId : "";
            this.startTime = typeof startTime !== 'undefined' ? startTime : "";
            this.endTime = typeof endTime !== 'undefined' ? endTime : "";
        }

    }
    agenda.prototype.init = function(agendaId, localDb){
        var self = this;
        localDb.queryAll ("agenda", {
            query: function(row) {
                if(row.ID == agendaId) {
                    self.agendaLocalId = agendaId;
                    self.agendaContent = row.agenda;
                    self.meetingId = row.meetingid;
                    self.userId = row.user_id;
                    self.agendaUniqueId = row.agendasub_id;
                    self.tag = row.tag;
                    self.ownerId = row.owner_id;
                    self.startTime= row.start_time;
                    self.endTime = row.end_time;
                }
            }
        });
    }

    agenda.prototype.insertToLocalStorage = function (localDb){
        var agendaId = localDb.insert("agenda", {
            meetingid:this.meetingId,
            agendasub_id: this.agendaUniqueId,
            user_id: this.userId,
            agenda: this.agendaContent,
            tag:this.tag,
            owner_id:this.ownerId,
            start_time:this.startTime,
            end_time:this.endTime
        });

        this.agendaLocalId = agendaId;
        var self = this;

        localDb.update(
            "meetings",
            {meetingid: this.meetingId},
            function(row){
                row.agenda_count = row.agenda_count+1;
                if((row.status=="published"||row.status=="pending") && self.tag!="old")
                    row.status="edited";
                return row;
            }
        );
        localDb.commit();
    }

    agenda.prototype.updateToLocalStorage = function (localDb){
        var self = this;
        localDb.update(
            "agenda",
            { ID: this.agendaLocalId },
            function (row) {
                row.agendasub_id = self.agendaUniqueId;
                row.meetingid = self.meetingId;
                row.agenda = self.agendaContent;
                row.tag = self.tag;
                row.user_id = self.userId;
                row.owner_id = self.ownerId;
                row.start_time = self.startTime;
                row.end_time = self.endTime;
                return row;
            }
        );
        localDb.update(
            "meetings",
            {meetingid: this.meetingId},
            function(row){
                if((row.status=="published"||row.status=="pending") && self.tag!="old")
                    row.status="edited";
                return row;
            }
        );
        localDb.commit();
    }

    agenda.prototype.updateToCloud = function (localDb) {
        var agendadata = {};
        var self = this;
        agendadata.OZINDEX = this.agendaUniqueId;
        agendadata.meetingid =this.meetingId;
        agendadata.userid = this.userId;
        agendadata.agenda = this.agendaContent;
        agendadata.agendasub_id = this.agendaUniqueId;
        agendadata.ownerid = this.ownerId;
        agendadata.starttime = this.startTime;
        agendadata.endtime = this.endTime;
        agendadata.tag = this.tag;
        return ApiCallService.apiCall (
            "update",
            "meetingify",
            "agenda",
            this.meetingId,
            agendadata)
            .then(function (data) {
                self.updateToLocalStorage(localDb);
            });
    }

    agenda.prototype.insertToCloud = function (localDb){
        var agendadata = {};
        var self = this;
        agendadata.meetingid =this.meetingId;
        agendadata.userid = this.userId;
        agendadata.agenda = this.agendaContent;
        agendadata.ownerid = this.ownerId;
        agendadata.starttime = this.startTime;
        agendadata.endtime = this.endTime;
        agendadata.tag = this.tag;
        return ApiCallService.apiCall(
            "push",
            "meetingify",
            "agenda",
            this.meetingId,
            agendadata)
            .then(function(data){
                self.agendaUniqueId = data.data.data.LASTID;
                return self.updateToCloud(localDb);
            });
    }

    agenda.prototype.removeFromLocalStorage = function (localDb){
        var self = this;
        localDb.deleteRows(
            "agenda",
            {ID:this.agendaLocalId}
        );
        localDb.commit();
    }

    agenda.prototype.removeFromCloud = function (localDb){
        var deferred = $q.defer();
        //url:"https://apps.orga.zone/apiv2/?appaction=delete&appname=meetingify&token="+session[0]["token"]+"&appsortint="+localStorage["singleID"];
        var agendadata = this.agendaUniqueId;
        var self = this;
        return ApiCallService.apiCall(
            "delete",
            "meetingify",
            "",
            -1,
            this.agendaUniqueId)
            .then(function(data){
                self.removeFromLocalStorage(localDb);
            });
    }

    return agenda;
}]);
