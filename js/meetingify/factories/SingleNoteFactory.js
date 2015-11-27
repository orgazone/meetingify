/**
 * Created by Relvin Gonzalez on 8/17/2015
 * Factory used for functions of the single notes view.
 */
meetingifyApp.factory('SingleNoteFactory', ['NoteObjectFactory',function(NoteObjectFactory) {
    //prepare single note page adding functionality to buttons
    var saveNote = function(isPublic) {
        //code run when adding a new note
        if (localStorage["mode"] == "new") {
            var myNote = new NoteObjectFactory(
                $("#note_content").val(),
                localStorage["singleID"],
                localStorage["current_user"]);
            myNote.tag = "new";
            myNote.isPublic = isPublic;
            myNote.userEmail = session[0]["user_email"];
            $('#editnote').modal('hide');
            myNote.insertToLocalStorage(meetingifyDB);
        }
        //code run when editing an existing note
        else if (localStorage["mode"] == "edit") {
            var myNote = new NoteObjectFactory(
                localStorage["noteID"],
                meetingifyDB);
            myNote.noteContent = $("#note_content").val();
            if(myNote.tag == "old")
                myNote.tag = "edit";
            myNote.isPublic = isPublic;
            $('#editnote').modal('hide');
            myNote.updateToLocalStorage(meetingifyDB);

        }
        return false;
    }

    //function to load notes to be shown
    var loadNotes = function(){
        //get all results that have not been tagged for deletion
        var queryResult =  meetingifyDB.queryAll("notes", {
            query: function(row) {
                if(row.meetingid == localStorage["singleID"] && (row.user_id==localStorage["current_user"]||row.is_public) && row.tag != "del") {
                    return true;
                } else {
                    return false;
                }
            }
        });
        return queryResult;
    }
    //remove a note when delete button click
    var removeNote = function(id,subId){
        if(localStorage["flag"] == "update_meeting") {
            if (confirm("Are you sure?"))
            {
                var myNote = new NoteObjectFactory(
                    id,
                    meetingifyDB
                );
                //if it is new then just delete it
                if(subId==0){
                    myNote.removeFromLocalStorage(meetingifyDB);
                }
                //else tag for deletion
                else{
                    myNote.tag = "del";
                    myNote.updateToLocalStorage(meetingifyDB);
                }

                //update the count
                meetingifyDB.update(
                    "meetings",
                    {meetingid: myNote.meetingId},
                    function(row){
                        row.notes_count = row.notes_count-1<0?0:row.notes_count-1;
                        return row;
                    }
                );
                meetingifyDB.commit();
                return true;
            }
        }
        return false;
    }

    return{
        saveNote:saveNote,
        loadNotes:loadNotes,
        removeNote:removeNote
    }

}]);
