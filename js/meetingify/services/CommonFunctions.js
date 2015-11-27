/**
 * Created by Relvin Gonzalez on 11/23/2015.
 * Functions commonly used.
 */
meetingifyApp.factory('CommonFunctions',['$location',function($location){
    return{
        //Logout function. session.logged_in=0 and redirect to index2.html
        logout : function() {
            meetingifyDB.update("session", {ID: 1}, function(row) {

                row.logged_in = 0;
                return row;
            });
            meetingifyDB.commit();
            $location.path("/");
        },

        //clears the local database
        clearMeetingifyLocalDB: function(){
            meetingifyDB.truncate("meetings");
            meetingifyDB.truncate("members");
            meetingifyDB.truncate("agenda");
            meetingifyDB.truncate("files");
            meetingifyDB.truncate("todos");
            meetingifyDB.truncate("notes");
            meetingifyDB.commit();
        },

        prepareNewMeeting: function(){

            localStorage['singleID']=0;
            localStorage['flag'] ='new_meeting';
            localStorage['mode'] = 'new';

            meetingifytempDB.truncate("meetings");
            meetingifytempDB.truncate("members");
            meetingifytempDB.truncate("agenda");
            meetingifytempDB.truncate("files");
            meetingifytempDB.truncate("todos");
            meetingifytempDB.truncate("notes");
            meetingifytempDB.commit();

        }
    }
}]);
