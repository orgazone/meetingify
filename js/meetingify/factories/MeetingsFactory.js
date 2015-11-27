/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for functions of the meetings view.
 */

meetingifyApp.factory('MeetingsFactory',function ($window) {

    //service function to retrieve all the meetings and return them
    var loadMeetings = function () {
      //clearMeetingifyLocalDB();
       var queryResult = meetingifyDB.queryAll("meetings");
       return queryResult;
    }
    var singleMeeting = function(meetingID){
        localStorage['flag'] = "update_meeting";
        $window.location.href = "#/single/"+meetingID;
    }

    return {
        loadMeetings:loadMeetings,
        singleMeeting:singleMeeting
    }
});
