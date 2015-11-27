/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for functions of the meeting basics view.
 */
meetingifyApp.factory('SingleBasicsFactory',['MeetingObjectFactory', function(MeetingObjectFactory) {

    //Function that activates the date time picker, populates the fields, and services the update button
    var saveMeeting = function (meeting) {
        if (localStorage['flag'] == "update_meeting") {
            var myMeeting = new MeetingObjectFactory(localStorage["singleID"], meetingifyDB);
            myMeeting.topic = meeting.topic;
            myMeeting.startDate = meeting.start_date;
            myMeeting.location = meeting.location;
            myMeeting.kind = meeting.kind;
            myMeeting.status = "edited";
            myMeeting.organizer = meeting.organizer;
            myMeeting.updateToLocalStorage(meetingifyDB);
            window.location.href = "#/single/"+localStorage['singleID'];
        }
        return false;
    }
    var meeting = function(){
        //populate fields
        if (localStorage['singleID'] != 0) {
            var meeting = meetingifyDB.queryAll("meetings", {query: {"meetingid": localStorage['singleID']}});
            if (meeting[0] == null) {
                return localStorage['singleID'] = 0;
            }
            else {
                return meeting[0];
            }
        }
    };
    return{
        saveMeeting:saveMeeting,
        meeting:meeting
    };
}]);
