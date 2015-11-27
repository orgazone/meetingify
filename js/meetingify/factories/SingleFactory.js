/**
 * Created by Relvin Gonzalez on 8/15/2015
 * Factory used for syncing data to the single view
 *
 */
meetingifyApp.factory('SingleFactory',['ApiCallService','$window', function(ApiCallService,$window) {

    var loadSingle = function () {
        var meeting = meetingifyDB.queryAll("meetings", {query: {"meetingid": localStorage['singleID']}});

        if (meeting[0] == null) {
            $window.location.href = "#/meetings";
        }

        return meeting[0];
    };

    var deleteMeeting = function() {
        if(confirm("Are you sure you want to delete this meeting?")) {
            ApiCallService.apiCallDeleteMeeting(localStorage['singleID'],true);
            return false;
        }
    };


    return {
        loadSingle:loadSingle,
        deleteMeeting :deleteMeeting
    }
}]);
