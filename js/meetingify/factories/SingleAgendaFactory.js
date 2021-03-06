/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for functions of the single agenda view.
 * It has functions to populate fields and update information
 */
meetingifyApp.factory('SingleAgendaFactory',['AgendaObjectFactory', function(AgendaObjectFactory) {
    //main operations
    var saveAgenda = function(agenda){
        if(localStorage["flag"] == "update_meeting"){
            if(localStorage["mode"] == "new") {
                var agendaContent = agenda.agenda;
                agendaContent.trim();
                var agendas = agendaContent.split(/\d\.\s+|[a-z]\)\s+|•\s+|[A-Z]\.\s+|[IVX]+\.\s+|\n+/);
                for(var i = 0; i<agendas.length;i++) {
                    if(agendas[i] === "")
                      continue;
                    var myAgenda = new AgendaObjectFactory(
                        agendas[i],
                        localStorage["singleID"],
                        localStorage["current_user"],
                        0,
                        0,
                        "new",
                        agenda.owner_id,
                        agenda.start_time,
                        agenda.end_time);
                    myAgenda.insertToLocalStorage(meetingifyDB);
                    $('#editagenda').modal('hide');
                }
            }
            //Edit existing Agenda
            else if(localStorage["mode"] == "edit") {
                var myAgenda = new AgendaObjectFactory(
                    localStorage['agendaID'],
                    meetingifyDB);
                myAgenda.agendaContent = agenda.agenda;
                myAgenda.ownerId = agenda.owner_id;
                myAgenda.startTime = agenda.start_time;
                myAgenda.endTime = agenda.end_time;
                if(myAgenda.tag == "old")
                    myAgenda.tag="edit";
                myAgenda.updateToLocalStorage(meetingifyDB);
                $('#editagenda').modal('hide');
            }
        }
    }

    //function for removing Agenda
    var removeAgenda = function (id,subId) {
        if(localStorage["flag"] == "update_meeting") {
            if (confirm("Are you sure?"))
            {
                var myAgenda = new AgendaObjectFactory(
                    id,
                    meetingifyDB
                );
                //if it is new then just delete it
                if(subId==0){
                    myAgenda.removeFromLocalStorage(meetingifyDB);
                }
                //else tag for deletion
                else{
                    myAgenda.tag = "del";
                    myAgenda.updateToLocalStorage(meetingifyDB);
                }

                //update the count
                meetingifyDB.update(
                    "meetings",
                    {meetingid: myAgenda.meetingId},
                    function(row){
                        row.agenda_count = row.agenda_count-1<0?0:row.agenda_count-1;
                        return row;
                    }
                );
                meetingifyDB.commit();
                return true;
            }
        }
        return false;
    }
    //function to load agendas
    var loadAgendas = function(){
        //get all results that have not been tagged for deletion
        var queryResult =  meetingifyDB.queryAll("agenda", {
            query: function(row) {
                if(row.meetingid == localStorage["singleID"] && row.tag != "del") {
                    return true;
                } else {
                    return false;
                }
            },
            sort: [["start_time", "ASC"]]
        });
        return queryResult;
    }

    var loadMembers = function(){
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
    var getMeeting = function(){
        var meetings = meetingifyDB.queryAll("meetings", { query: {"meetingid": localStorage['singleID']}
        });
        return meetings[0];
    }
    // }
    return {
        saveAgenda:saveAgenda,
        removeAgenda:removeAgenda,
        loadAgendas:loadAgendas,
        loadMembers:loadMembers,
        getMeeting:getMeeting
    }
}]);
