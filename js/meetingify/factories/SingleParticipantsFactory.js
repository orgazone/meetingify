/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for functions of the meeting basics view.
 */
meetingifyApp.factory('SingleParticipantsFactory',['$q','MemberObjectFactory', function($q,MemberObjectFactory) {

    //function of save button of modal
    var saveOperations = function(members) {
        if (localStorage["flag"] == "update_meeting") {
            //add new Participant
            var pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
            if (localStorage["mode"] == "new") {
                for(var i = 0;i<members.length;i++) {
                    //extract user email
                    var userEmail = members[i].text.match(pattern)[0];
                    //if no valid user email found, continue to next entry without adding this one!
                    if(!userEmail)
                        continue;

                    //check if name is present in username <email>
                    var userName= members[i].text.match(/^(?:(?!<).)*/g)[0];
                    //test if the tag only includes an email, if it does then set the name as blank ""
                    if(userName) { //if userName exists
                        if (pattern.test(userName)) //test if it is actually a name and not an email
                            userName = " ";
                        else
                            userName = userName.trim();
                    }
                    var myMember = new MemberObjectFactory(
                        userEmail,
                        userName,
                        "no",
                        localStorage["singleID"],
                        0);
                    myMember.tag = "new";
                    myMember.invited = "no";
                    myMember.insertToLocalStorage(meetingifyDB);
                }

                $('#addmod').modal('hide');
            }
            //Edit participant
            else if (localStorage["mode"] == "edit") {

                var myMember = new MemberObjectFactory(
                    localStorage["participantID"],
                    meetingifyDB);
                myMember.email = $("#user_email").val();
                myMember.fullname = $("#user_name").val();
                if(myMember.tag != "new")
                    myMember.tag = "edit";
                myMember.updateToLocalStorage(meetingifyDB);
                $('#editmod').modal('hide');
            }
        }
    }

    //function to load participants
    var loadParticipants = function(){
        var queryResult =  meetingifyDB.queryAll("members", {
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
    var removeParticipants = function(id,subId){
        if(localStorage["flag"] == "update_meeting") {
            if (confirm("Are you sure?"))
            {
                var myMember = new MemberObjectFactory(
                    id,
                    meetingifyDB
                );
                //if it is new then just delete it
                if(subId==0){
                    myMember.removeFromLocalStorage(meetingifyDB);

                    //delete all todos from this user
                    meetingifyDB.deleteRows(
                        "todos",
                        {user_id:id}
                    );
                    meetingifyDB.commit();
                }
                //else tag for deletion
                else{
                    myMember.tag = "del";
                    myMember.updateToLocalStorage(meetingifyDB);
                    var todosCount = 0;

                    meetingifyDB.update(
                        "todos",
                        {user_id: id},
                        function(row){
                            row.tag = "del";
                            todosCount ++;
                            return row;
                        }
                    );
                    meetingifyDB.commit();
                }

                meetingifyDB.update(
                    "meetings",
                    {meetingid: myMember.meetingId},
                    function(row){
                        row.members_count = row.members_count-1<0?0:row.members_count-1;
                        row.todos_count = row.todos_count-todosCount<0?0:row.todos_count-todosCount;
                        return row;
                    }
                );

                meetingifyDB.commit();
                return true;
            }
        }
    }

    return{
        saveOperations:saveOperations,
        loadParticipants:loadParticipants,
        removeParticipants:removeParticipants
    }
}]);
