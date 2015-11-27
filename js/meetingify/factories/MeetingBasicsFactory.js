/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for functions of the meeting basics view.
 */
meetingifyApp.factory('MeetingBasicsFactory', ['MeetingObjectFactory','MemberObjectFactory','$window',
    function(MeetingObjectFactory,MemberObjectFactory,$window) {
        var getMeeting = function(){
            var meeting = {};
            if(localStorage['mode'] == 'new') {
                meeting.topic = "";
                meeting.start_date="";
                meeting.location="";
                meeting.kind ="Information";
            }
            else if(localStorage['mode'] == 'edit'){
                var result = meetingifyDB.queryAll("meetings",{query:{"meetingid":localStorage['singleID']}});

                if(result[0] == null) {
                    localStorage['singleID'] =0;
                    meeting.topic = "";
                    meeting.start_date="";
                    meeting.location="";
                    meeting.kind ="Information";
                }
                else{
                    meeting = result[0];
                }

            }
            return meeting;
        }
        var saveMeeting = function(meeting){
            if(localStorage['flag'] != "new_meeting")
                return false;
            if(localStorage['mode']=='new') {
                var myMeeting = new MeetingObjectFactory(
                    meeting.topic,
                    meeting.location,
                    meeting.start_date,
                    meeting.kind,
                    0,
                    0,
                    0,
                    0,
                    0,
                    "edited",
                    0,
                    0,
                    localStorage["current_user"]
                );
                myMeeting.insertToLocalStorage(meetingifyDB);
                //automatically add the current user to the participants of the new meeting
                var myMember = new MemberObjectFactory(
                    localStorage["user_email"],
                    session[0]['first_name'] + " " + session[0]['last_name'],
                    "no",
                    localStorage["singleID"],
                    0,
                    0,
                    "no",
                    "new");
                myMember.insertToLocalStorage(meetingifyDB);
                localStorage['mode'] = 'edit';
            }

            else if(localStorage['mode']=='edit'){
                var myMeeting = new MeetingObjectFactory(localStorage["singleID"], meetingifyDB);
                myMeeting.topic =  meeting.topic;
                myMeeting.start_date =  meeting.start_date;
                myMeeting.location =  meeting.location;
                myMeeting.kind =  meeting.kind;

                myMeeting.updateToLocalStorage(meetingifyDB);
            }
            // change the path
            $window.location.href = "#/meeting_participants";

        }

        return {getMeeting:getMeeting,
                saveMeeting:saveMeeting
        };
    }]);
