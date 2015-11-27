/**
 * Created by Relvin Gonzalez on 8/18/2015
 * Factory used for functions of the meeting agenda view.
 * It has functions to populate fields and update information
 */
meetingifyApp.factory('MeetingFilesFactory', ['FileObjectFactory','$q',function(FileObjectFactory,$q) {

    //Upload file
    var uploadFile = function(fileToUpload) {
        if (localStorage["flag"] == "new_meeting") {
            if (localStorage["mode"] == "new") {
                //prepare file name, remove blank spaces
                var fileToUpload = $('input[type=file]')[0].files[0];
                var filename = $('input[type=file]').val().replace(/C:\\fakepath\\/i, '');
                if(extensionCheck(filename)) {
                    var myFile = new FileObjectFactory(
                        filename,
                        "",
                        fileToUpload,
                        localStorage["singleID"],
                        localStorage["current_user"]);
                    myFile.tag = "new";
                    myFile.insertToLocalStorage(meetingifyDB);
                    $('#uploadfile').modal('hide');
                }
                else{
                    $('#uploadfile').modal('hide');
                    alert("File extension not supported!");
                }
            }
            else if (localStorage["mode"] == "edit") {
                //cant edit file for now
            }
        }
    }

    // load files to show on page
    var loadFiles = function() {
        var queryResult = meetingifyDB.queryAll("files", {
            query: function(row) {
                if(row.meetingid == localStorage["singleID"] && row.tag != "del") {
                    return true;
                } else {
                    return false;
                }
            }
        });
        return queryResult;
    }

    //Function to remove file
    var removeFile = function(id,subId){
        if(localStorage["flag"] == "new_meeting") {
            if (confirm("Are you sure?"))
            {
                var myFile = new FileObjectFactory(
                    id,
                    meetingifyDB
                );
                //if it is new then just delete it
                if(subId==0){
                    myFile.removeFromLocalStorage(meetingifyDB);
                }
                //else tag for deletion
                else{
                    myFile.tag = "del";
                    myFile.updateToLocalStorage(meetingifyDB);
                }
                //substract one from files count and comit to localstorage
                meetingifyDB.update(
                    "meetings",
                    {meetingid: myFile.meetingId},
                    function(row){
                        row.files_count = row.files_count-1<0?0:row.files_count-1;
                        return row;
                    }
                );
                meetingifyDB.commit();

                return true;
            }
        }
    }

    //function to download file
    var downloadFile = function(file){
        var myFile = new FileObjectFactory(
            file.filename,
            file.url,
            file.file,
            file.meetingid,
            file.user_id,
            file.ID,
            file.filessub_id
        );
        myFile.downloadFromLocalStorage(meetingifyDB);
    }

    return{
        uploadFile:uploadFile,
        loadFiles:loadFiles,
        removeFile:removeFile,
        downloadFile:downloadFile
    }
}]);
