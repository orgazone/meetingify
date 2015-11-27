/**
 * Created by Relvin Gonzalez on 8/14/2015.
 */
meetingifyApp.controller('MeetingsController', ['MeetingsFactory',function(MeetingsFactory){
    var vm = this;
    vm.orderByField = 'start_date';
    vm.reverseSort = false;
    vm.meetings = MeetingsFactory.loadMeetings();
    vm.singleMeeting = MeetingsFactory.singleMeeting;
}]);
