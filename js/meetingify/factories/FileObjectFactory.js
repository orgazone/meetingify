/**
 * Created by Relvin Gonzalez on 8/21/2015
 * Creates Agenda Objects for use on any other factory
 *
 */
meetingifyApp.factory('FileObjectFactory',['ApiCallService','$q' ,function(ApiCallService,$q){

//-------------------------------------------------
//  meetingId : meeting Id
//  userId  : user ID of meeting creator
//  fileLocalId   :  ID of a file on localstorage
//  FileUniqueId: ID of a file on cloud
//-------------------------------------------------


    var FileObject = function(filename, url, file, meetingId, userId, fileLocalId, FileUniqueId,tag){
        if(arguments.length == 2){
            this.init(filename, url);
        }
        else{
            this.filename = filename;
            this.url = url;
            this.file = file;
            this.meetingId = meetingId;
            this.userId = userId;
            this.fileLocalId = typeof fileLocalId!== 'undefined' ? fileLocalId : 0;
            this.fileUniqueId = typeof FileUniqueId !== 'undefined' ? FileUniqueId : 0;
            this.tag = typeof tag !== 'undefined' ? tag : "New";
        }

    }
    FileObject.prototype.init = function(fileId, localDb){
        var self = this;
        localDb.queryAll ("files", {
            query: function(row) {
                if(row.ID == fileId) {
                    self.fileLocalId = fileId;
                    self.filename = row.filename;
                    self.file = row.file;
                    self.url = row.url;
                    self.meetingId = row.meetingid;
                    self.userId = row.user_id;
                    self.fileUniqueId = row.filessub_id;
                    self.tag = row.tag;
                }
            }
        });
    }

    FileObject.prototype.insertToLocalStorage = function (localDb){
        var fileId = localDb.insert("files", {
            meetingid:this.meetingId,
            filessub_id: this.fileUniqueId,
            file: this.file,
            user_id: this.userId,
            filename: this.filename,
            fullname: session[0]["first_name"] + " " + session[0]["last_name"],
            url:this.url,
            tag:this.tag
        });
        this.fileLocalId = fileId;
        var self = this;
        localDb.update(
            "meetings",
            { meetingid: this.meetingId },
            function(row){
                row.files_count = row.files_count+1;
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

    FileObject.prototype.updateToLocalStorage = function (localDb){
        var self = this;
        localDb.update(
            "files",
            { ID: this.fileLocalId },
            function (row) {
                row.filessub_id = self.fileUniqueId;
                //file content
                row.meetingid = self.meetingId;
                row.url = self.url;
                row.file = self.file;
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

    FileObject.prototype.updateToCloud = function (localDb) {
        var filedata = {};
        var self = this;
        filedata.OZINDEX = this.fileUniqueId;
        filedata.meetingid =this.meetingId;
        filedata.userid = this.userId;
        filedata.url = this.url;
        filedata.filename = this.filename;
        filedata.tag = this.tag;

       return ApiCallService.apiCall (
            "update",
            "meetingify",
            "file",
            this.meetingId,
            filedata)
            .then(function (data) {
                self.updateToLocalStorage(localDb);
            });
    }

    FileObject.prototype.insertToCloud = function (localDb){

        var filedata = {};
        var self = this;
        var deferred = $q.defer();

        filedata.meetingid =this.meetingId;
        filedata.userid = this.userId;
        //filedata.fullname = session[0]["first_name"] + " " + session[0]["last_name"];
        filedata.filename = this.filename;
        filedata.tag = this.tag;
        //check to see if the extension of the file is supported before attempting to upload
        if(extensionCheck(this.filename)) {
            ApiCallService.apiCallFileUpload(
                this.file,
                this.meetingId,
                filedata)
                .then(function (data) {
                    self.fileUniqueId = data.data.data.OZINDEX;
                    self.url = data.data.data.url;
                    self.updateToCloud(localDb).then(function(data){
                        deferred.resolve();
                    });
                });
        }
        else{
            alert("File extension not supported!");
            deferred.reject();
        }
        return deferred.promise;
    }

    FileObject.prototype.downloadFromCloud = function (){
        //check to see if the extension of the file is supported before attempting to upload
        var f = this.filename;
        return   ApiCallService.apiCallFileDownload(
                this.meetingId,
                this.filename,
                this.fileUniqueId,
                this.url);
    }
    FileObject.prototype.downloadFromLocalStorage = function (localDb){
        //check to see if the extension of the file is supported before attempting to upload
        var self = this;
        var fileId = this.fileLocalId;
        var file =  this.file;
        var defaultFileName=this.filename;
        //create a blob to then save it on user computer
        defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
        //var fileDownload = new Blob(file, { type: "application/octet-stream" });
        saveAs(file, defaultFileName);
    }

    FileObject.prototype.removeFromLocalStorage = function (localDb){
        var self = this;
        localDb.deleteRows(
            "files",
            {ID:this.fileLocalId}
        );
        localDb.commit();
    }

    FileObject.prototype.removeFromCloud = function (localDb){
        //url:"https://apps.orga.zone/apiv2/?appaction=delete&appname=meetingify&token="+session[0]["token"]+"&appsortint="+localStorage["singleID"];
        var agendadata = this.agendaUniqueId;
        var self = this;
        return ApiCallService.apiCall(
            "delete",
            "meetingify",
            "FILE",
            -1,
            this.fileUniqueId)
            .then(function(data){
                self.removeFromLocalStorage(localDb);
            });
    }

    return FileObject;
}]);
