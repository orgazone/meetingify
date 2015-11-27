/**
 * Created by Relvin Gonzalez on 8/20/2015
 * Creates Meeting Objects for use on any other factory
 *
 */
meetingifyApp.factory('MeetingObjectFactory',['ApiCallService','$q' ,function(ApiCallService,$q){
//
//  meetingLocalId: meeting Id on localStorage
//  meetingUniqueId : meeting Id on Cloud
//  userId  : user ID of meeting creator

    var MeetingObject = function(topic,
                                 location,
                                 startDate,
                                 kind,
                                 membersCount,
                                 agendaCount,
                                 filesCount,
                                 notesCount,
                                 todosCount,
                                 status,
                                 meetingLocalId,
                                 meetingUniqueId,
                                 organizer)
    {
        if(arguments.length == 2){
            this.init(topic, location);
        }
        else{
            this.topic = topic;
            this.location = location;
            this.startDate = startDate;
            this.kind = kind;
            this.membersCount = membersCount;
            this.agendaCount = agendaCount;
            this.filesCount = filesCount;
            this.notesCount = notesCount;
            this.todosCount = todosCount;
            this.status = status;
            this.dateCreated = "";
            this.meetingLocalId = meetingLocalId;
            this.organizer = organizer;
            this.meetingUniqueId = typeof meetingUniqueId !== 'undefined' ? meetingUniqueId : localStorage['singleID'];
        }

    }

    MeetingObject.prototype.init = function(meetingUniqueId, localDb){
        var self = this;

        localDb.queryAll ("meetings", {
            query: function(row) {
                if(row.meetingid == meetingUniqueId) {
                    self.meetingLocalId = meetingUniqueId;
                    self.topic = row.topic;
                    self.location = row.location
                    self.startDate = row.start_date;
                    self.dateCreated = row.date_created;
                    self.kind = row.kind;
                    self.membersCount = row.members_count;
                    self.agendaContent = row.agenda_count;
                    self.filesCount = row.files_count;
                    self.notesCount = row.notes_count;
                    self.todosCount = row.todos_count;
                    self.status = row.status;
                    self.meetingUniqueId = row.meetingid;
                    self.organizer = localStorage["current_user"];
                }
            }
        });
    }

    MeetingObject.prototype.insertToLocalStorage = function (localDb){
        var meetingLocalId = localDb.insert("meetings", {
            meetingid: this.meetingUniqueId,
            localid: this.meetingLocalId,
            topic: this.topic,
            start_date: this.startDate,
            date_created: formatDate(new Date()),
            location: this.location,
            kind: this.kind,
            members_count: this.membersCount,
            agenda_count: this.agendaCount,
            files_count: this.filesCount,
            notes_count: this.notesCount,
            todos_count: this.todosCount,
            status:"pending",
            organizer:this.organizer
        });
        this.meetingLocalId = meetingLocalId;
        localStorage['singleID'] = meetingLocalId;
        var self = this;

        localDb.update(
            "session",
            { ID: 1 },
            function(row){
                row.meetings_count = row.meetings_count+1;
                return row;
            }
        );
        localDb.commit();

        // set the meeting ID to the local storage ID for now. Will change it to the cloud ID once we publish it
        localDb.update(
            "meetings",
            { ID: meetingLocalId },
            function (row) {
                row.meetingid = self.meetingLocalId;
                return row;
            });
        //update meeting id to id created by insertion
        localDb.commit();

    }

    MeetingObject.prototype.updateToLocalStorage = function (localDb){
        var self = this;

        localDb.update(
            "meetings",
            { meetingid: localStorage['singleID'] },
            function (row) {
                row.meetingid = self.meetingUniqueId;
                row.topic = self.topic;
                row.location = self.location;
                row.kind = self.kind;
                row.start_date = self.startDate;
                row.location = self.location;
                row.kind = self.kind;
                row.status = self.status;
                row.date_created = self.dateCreated;
                row.organizer = self.organizer;
                return row;
            }
        );
        meetingifyDB.update(
            "meetings",
            {meetingid: this.meetingUniqueId},
            function(row){
                if(row.status=="published")
                    row.status="edited";
                return row;
            }
        );
        localDb.commit();
    }

    MeetingObject.prototype.updateToCloud = function (localDb) {
        var deferred = $q.defer();
        var meetingdata = {};
        var self = this;
        meetingdata.OZINDEX = this.meetingUniqueId;
        meetingdata.meetingid =this.meetingUniqueId;
        meetingdata.topic = this.topic;
        meetingdata.location = this.location;
        meetingdata.kind = this.kind;
        meetingdata.start_date = this.startDate;
        meetingdata.date_created = this.dateCreated;
        meetingdata.members_count = this.membersCount;
        meetingdata.agenda_count = this.agendaCount;
        meetingdata.files_count = this.filesCount;
        meetingdata.notes_count = this.notesCount;
        meetingdata.todos_count = this.todosCount;
        meetingdata.status = this.status;
        meetingdata.organizer = this.organizer;
        $("#loading").show();
        ApiCallService.apiCall (
            "update",
            "meetingify",
            "meetings",
            this.meetingUniqueId,
            meetingdata)
            .then(
            function (data) {
                $("#loading").hide();
                self.updateToLocalStorage(localDb)
                deferred.resolve(meetingdata.meetingid);
            },
            function (error) {
                $("#loading").hide();
                deferred.reject("Error updating the meeting.");
            });
        return deferred.promise;
    }

    MeetingObject.prototype.insertToCloud = function (localDb){
        var deferred = $q.defer();
        var meetingdata = {};
        var self = this;
        meetingdata.OZINDEX = this.meetingUniqueId;
        meetingdata.meetingid =this.meetingUniqueId;
        meetingdata.topic = this.topic;
        meetingdata.location = this.location;
        meetingdata.kind = this.kind;
        meetingdata.start_date = this.startDate;
        meetingdata.date_created = this.dateCreated;
        meetingdata.members_count = this.membersCount;
        meetingdata.agenda_count = this.agendaCount;
        meetingdata.files_count = this.filesCount;
        meetingdata.notes_count = this.notesCount;
        meetingdata.todos_count = this.todosCount;
        meetingdata.status = this.status;
        meetingdata.organizer = this.organizer;
        $("#loading").show();

        ApiCallService.apiCall(
            "push",
            "meetingify",
            "meetings",
            localStorage["current_user"],
            meetingdata)
            .then(function(data){
                //localStorage['singleID'] = data.data.LASTID;
                self.meetingUniqueId = data.data.data.LASTID;
                // self.insertToLocalStorage(localDb);
                self.updateToCloud(localDb).then(function(result){
                    deferred.resolve(self.meetingUniqueId);
                },function(error){
                    deferred.reject("Error publishing meeting.")
                });
            },function(error){
                deferred.reject("Error publishing meeting.");
            });
        return deferred.promise;
    }

    MeetingObject.prototype.removeFromCloud = function(redirect){
       return ApiCallService.apiCallDeleteMeeting(this.meetingUniqueId,redirect);
    }

    return MeetingObject;
}])
