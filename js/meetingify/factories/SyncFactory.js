/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for syncing data
 *
 */
meetingifyApp.factory('SyncFactory', ['$q','ApiCallService','MeetingPublishFactory','CommonFunctions',
    function($q,ApiCallService,MeetingPublishFactory,CommonFunctions) {

    var loadingText = "";
    var loadingMeeting = "";
    //save all edited meetings to the cloud before syncing
    var syncAll = function(){
        var promises = [];
        loadingText = "MESSAGE.SYNC_SAVING_CHANGES";
        //if meeting have been edited but not saved to cloud, save first before syncing the rest.
        meetingifyDB.queryAll("meetings", {
            query: function(row) {
                if(row.status === 'edited') {
                    promises.push(MeetingPublishFactory.publishNow('save','',row.meetingid));
                }
            }
        });

       return $q.all(promises).then(function(data){
           return getAllMeetings();
        })
    }

    //function to get meetings where the user is a participant
    function getAllMeetings(){
        CommonFunctions.clearMeetingifyLocalDB();
        var appData = {};
        appData.email  = localStorage['user_email'];
        //appaction, appname, appsortstr, appsortint, token, appdata
      return  ApiCallService.apiCall(
            "search",
            "meetingify",
            "members",
            "",
            appData
        )
        .then(function(data) {
                var returnedData = data.data;
              if(returnedData.success != 0) {
                  var index = returnedData.data.length;
                  var meetings = [];
                  for (var i = 0; i < index; i++) {
                      var meetingid = returnedData.data[i].OZSORTINT;
                      meetings.push(meetingid);
                  }
                  return syncMeetings(meetings);//include meetings in the function arguments
              }
              else if(returnedData.error == "Result empty!")
                 alert("You are not a participant in any meeting.");
            }).then(function(data){
              loadingText = "MESSAGE.DONE";
              //Update counts of everything per meeting (files, members, agenda, etc).
              updateCounts();
          })
    }


    function syncMeetings(meetings) {
        var data = {};
        data.perpage = 1000;
        var promises = [];
        loadingText = "MESSAGE.SYNC_MEETINGS";
        //get all data of each searate meeting
        angular.forEach(meetings,function(meetingId){
            //appaction, appname, appsortstr, appsortint, token, appdata
            var promise = ApiCallService.apiCall(
                "request",
                "meetingify",
                "meetings",
                meetingId,
                "")
                .then(function (data) {
                    var returnedData = data.data;
                    var index = returnedData.data.lines.length;
                    for (var i = 0; i < index; i++) {
                        var data = returnedData.data.lines[i].OZAPPDATA;
                        meetingifyDB.insert("meetings", {
                            organizer:data.organizer,
                            meetingid: data.meetingid,
                            topic: data.topic,
                            location: data.location,
                            kind: data.kind,
                            start_date: data.start_date.replace(/\\/g, ""),
                            date_created: data.date_created,
                            members_count: data.members_count,
                            files_count: data.files_count,
                            agenda_count: data.agenda_count,
                            notes_count: data.notes_count,
                            todos_count: data.todos_count,
                            status: data.status
                        });
                        meetingifyDB.commit();
                    }
                   return syncAgenda(meetingId);
                }).
                catch(function(error) {
                    alert(error);
                }
            );
          promises.push(promise);
        })
        return $q.all(promises);
    }

    function syncAgenda(meetingId){
       // loadingText = "'MESSAGE.SYNC_AGENDA'|translate:'{id:"+meetingId+"}'";
        loadingMeeting = meetingId;
        loadingText = "MESSAGE.SYNC_AGENDA";
        //appaction, appname, appsortstr, appsortint, token, appdata
        return ApiCallService.apiCall(
            "request",
            "meetingify",
            "agenda",
            meetingId,
            "")
            .then(function(data){
                for(var i=0;i<data.data.data.lines.length;i++){
                    var appdata = data.data.data.lines[i].OZAPPDATA;
                    meetingifyDB.insert("agenda", {
                        meetingid: appdata.meetingid,
                        user_id: appdata.userid,
                        agendasub_id: appdata.agendasub_id,
                        agenda: appdata.agenda,
                        owner_id:appdata.ownerid,
                        start_time:appdata.starttime,
                        tag:appdata.tag,
                        end_time:appdata.endtime
                    });
                    meetingifyDB.commit();
                }
               return syncMembers(meetingId);
            }).catch(
            function(error){
                alert(error);
            }
        );
    }

    function syncMembers(meetingId){
        loadingMeeting = meetingId;
        loadingText = "MESSAGE.SYNC_MEMBERS";
        //appaction, appname, appsortstr, appsortint, token, appdata
        return ApiCallService.apiCall(
            "request",
            "meetingify",
            "members",
            meetingId,
            "")
            .then(function(data){
                for(var i=0;i<data.data.data.lines.length;i++){
                    var appdata = data.data.data.lines[i].OZAPPDATA;
                    meetingifyDB.insert("members", {
                        meetingid: appdata.meetingid,
                        userid: appdata.userid,
                        fullname: appdata.fullname,
                        user_email: appdata.email,
                        tag:appdata.tag,
                        invited:appdata.invited,
                        confirmed: appdata.confirmed
                    });
                    meetingifyDB.commit();
                }
               return syncFiles(meetingId);
            }).catch(function(error){
                alert(error);
            }
        );
    }

    function syncFiles(meetingId){
        loadingMeeting = meetingId;
        loadingText = "MESSAGE.SYNC_FILES";
        //appaction, appname, appsortstr, appsortint, token, appdata
        return ApiCallService.apiCall(
            "request",
            "meetingify",
            "FILE",
            meetingId,
            "")
            .then(function(data){
                var resultData = data.data;
                for(var i=0;i<resultData.data.lines.length;i++){
                    var appdata = resultData.data.lines[i].OZAPPDATA;
                    meetingifyDB.insert("files", {
                        meetingid: resultData.data.lines[i].OZSORTINT,
                        user_id: resultData.data.lines[i].OZUSRID,
                        filename: appdata.filename,
                        url: appdata.url.replace(/\\\//g, "/"),
                        filessub_id:resultData.data.lines[i].OZINDEX,
                        tag:appdata.tag
                    });
                    meetingifyDB.commit();
                }
               return syncNotes(meetingId);
            }).catch(function(error){
                alert(error);
            }
        );
    }

    function syncNotes(meetingId){
        loadingMeeting = meetingId;
        loadingText = "MESSAGE.SYNC_FILES";
        //appaction, appname, appsortstr, appsortint, token, appdata
        return ApiCallService.apiCall(
            "request",
            "meetingify",
            "notes",
            meetingId,
            "")
            .then(function(data){
                for(var i=0;i<data.data.data.lines.length;i++){
                    var appdata = data.data.data.lines[i].OZAPPDATA;
                    //Only add notes that belong to the user or are public
                    if(appdata.userid == localStorage['current_user']||appdata.isPublic){
                        meetingifyDB.insert("notes", {
                            meetingid: appdata.meetingid,
                            user_id: appdata.userid,
                            notesub_id: appdata.notesub_id,
                            note: appdata.note,
                            is_public: appdata.isPublic,
                            tag:appdata.tag,
                            user_email:appdata.userEmail
                        });
                        meetingifyDB.commit();
                    }
                }
              return syncTodos(meetingId);
            }).catch(function(error){
                alert(error);
            }
        );
    }

    function syncTodos(meetingId){
        loadingMeeting = meetingId;
        loadingText = "MESSAGE.SYNC_TODOS";
        //appaction, appname, appsortstr, appsortint, token, appdata
        return ApiCallService.apiCall(
            "request",
            "meetingify",
            "todos",
            meetingId,
            "")
            .then(function(data){
                for(var i=0;i<data.data.data.lines.length;i++){
                    var appdata = data.data.data.lines[i].OZAPPDATA;
                    meetingifyDB.insert("todos", {
                        meetingid: appdata.meetingid,
                        user_id: appdata.userid,
                        todossub_id: appdata.todossub_id,
                        todos: appdata.todos,
                        deadline: appdata.deadline.replace(/\\/g, ""),
                        status: appdata.status,
                        tag:appdata.tag
                    });
                    meetingifyDB.commit();
                }

                //add a last synced value to the session.
                var lastSynced = formatDate(new Date());
                meetingifyDB.update("session", {ID: 1}, function(row) {
                    row.last_synced=lastSynced;
                    return row;
                });
                session[0]["last_synced"] = lastSynced;
                meetingifyDB.commit();

            }).catch(function(error){
                alert(error);
            }
        );
    }

    //update local counts of all meetings for local view
    function updateCounts(){
        meetingifyDB.queryAll("meetings", {
            query: function(row) {
                var meetingId = row.meetingid;
                var members_count = 0,files_count = 0,agenda_count = 0,notes_count = 0,todos_count = 0;
                meetingifyDB.queryAll("members", {
                    query: function(row) {
                        if(row.meetingid == meetingId) {
                            members_count +=1;
                        }
                    }
                });
                meetingifyDB.queryAll("files", {
                    query: function(row) {
                        if(row.meetingid == meetingId) {
                            files_count +=1;
                        }
                    }
                });
                meetingifyDB.queryAll("agenda", {
                    query: function(row) {
                        if(row.meetingid == meetingId) {
                            agenda_count +=1;
                        }
                    }
                });
                meetingifyDB.queryAll("notes", {
                    query: function(row) {
                        if(row.meetingid == meetingId) {
                            notes_count +=1;
                        }
                    }
                });
                meetingifyDB.queryAll("todos", {
                    query: function(row) {
                        if(row.meetingid == meetingId) {
                            todos_count +=1;
                        }
                    }
                });
                meetingifyDB.update("meetings", {meetingid: meetingId}, function(row) {
                    row.members_count = members_count;
                    row.files_count = files_count;
                    row.agenda_count = agenda_count;
                    row.notes_count = notes_count;
                    row.todos_count = todos_count;
                    // the update callback function returns to the modified record
                    return row;
                });
            }
        });

        meetingifyDB.commit();
    }

    function getLoadingText(){
        return loadingText;
    }
    function getLoadingMeeting(){
        return loadingMeeting;
    }

    return {syncAll:syncAll,
            getLoadingText:getLoadingText,
            getLoadingMeeting:getLoadingMeeting};
}]);
