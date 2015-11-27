/**
 * Created by Relvin Gonzalez on 8/20/2015
 * Creates Meeting Objects for use on any other factory
 *
 */
meetingifyApp.factory('NoteObjectFactory',['ApiCallService','$q' ,function(ApiCallService,$q){

    //
//  noteContent: note Content
//  meetingId : meeting Id
//  userId  : user ID of meeting creator
//  noteLocalId   :  ID of an note on localstorage
//  noteUniqueId: ID of an note on cloud

    var NoteObject = function(noteContent, meetingId, userId, noteLocalId, noteUniqueId,isPublic,userEmail,tag){
        if(arguments.length == 2){
            this.init(noteContent, meetingId);
        }
        else{
            this.noteContent = noteContent;
            this.meetingId = meetingId;
            this.userId = userId;
            this.noteLocalId = typeof noteLocalId!== 'undefined' ? noteLocalId : 0;
            this.noteUniqueId = typeof noteUniqueId !== 'undefined' ? noteUniqueId : 0;
            this.isPublic = typeof isPublic !== 'undefined' ? isPublic : false;
            this.userEmail = typeof userEmail !== 'undefined' ? userEmail : " ";
            this.tag = typeof tag !== 'undefined' ? tag : "";
        }

    }
    NoteObject.prototype.init = function(noteId, localDb){
        var self = this;
        localDb.queryAll ("notes", {
            query: function(row) {
                if(row.ID == noteId) {
                    self.noteLocalId = noteId;
                    self.noteContent = row.note;
                    self.meetingId = row.meetingid;
                    self.userId = row.user_id;
                    self.userEmail = row.user_email;
                    self.noteUniqueId = row.notesub_id;
                    self.isPublic = row.is_public;
                    self.tag = row.tag;
                }
            }
        });
    }

    NoteObject.prototype.insertToLocalStorage = function (localDb){
        var noteId = localDb.insert("notes", {
            meetingid:this.meetingId,
            notesub_id: this.noteUniqueId,
            user_id: this.userId,
            note: this.noteContent,
            user_email: this.userEmail,
            is_public : this.isPublic,
            tag: this.tag
        });
        this.noteLocalId = noteId;
        var self = this;
        localDb.update(
            "meetings",
            {meetingid: this.meetingId},
            function(row){
                row.notes_count = row.notes_count+1;
                if((row.status=="published"||row.status=="pending") && self.tag!="old")
                    row.status="edited";
                return row;
            }
        );
        localDb.commit();
    }

    NoteObject.prototype.updateToLocalStorage = function (localDb){
        var self = this;
        localDb.update(
            "notes",
            { ID: this.noteLocalId },
            function (row) {
                row.notesub_id = self.noteUniqueId;
                row.note = self.noteContent;
                row.meetingid = self.meetingId;
                row.is_public = self.isPublic;
                row.user_email = self.userEmail;
                row.tag = self.tag;
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

    NoteObject.prototype.updateToCloud = function (localDb) {
        var notedata = {};
        var self = this;
        notedata.OZINDEX = this.noteUniqueId;
        notedata.meetingid =this.meetingId;
        notedata.userid = this.userId;
        notedata.note = this.noteContent;
        notedata.notesub_id = this.noteUniqueId;
        notedata.isPublic = this.isPublic;
        notedata.userEmail = this.userEmail;
        notedata.tag = this.tag;

        return ApiCallService.apiCall (
            "update",
            "meetingify",
            "notes",
            this.meetingId,
            notedata)
            .then(
            function (data) {
                self.updateToLocalStorage(localDb);
            });
    }

    NoteObject.prototype.insertToCloud = function (localDb){
        var notedata = {};
        var self = this;
        notedata.meetingid =this.meetingId;
        notedata.userid = this.userId;
        notedata.note = this.noteContent;
        notedata.isPublic = this.isPublic;
        notedata.userEmail = this.userEmail;
        notedata.tag = this.tag;
        return ApiCallService.apiCall(
            "push",
            "meetingify",
            "notes",
            this.meetingId,
            notedata)
            .then(
            function(data){
                self.noteUniqueId = data.data.data.LASTID;
                return self.updateToCloud(localDb);
            });
    }

    NoteObject.prototype.removeFromLocalStorage = function (localDb){
        var self = this;
        localDb.deleteRows(
            "notes",
            {ID:this.noteLocalId}
        );
        localDb.commit();
    }

    NoteObject.prototype.removeFromCloud = function (localDb){
        var notedata = this.noteUniqueId;
        var self = this;
        return ApiCallService.apiCall(
            "delete",
            "meetingify",
            "",
            -1,
            this.noteUniqueId)
            .then(function(data){
                self.removeFromLocalStorage(localDb);
            });
    }

return NoteObject;

}]);
