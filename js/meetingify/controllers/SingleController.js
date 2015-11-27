/**
 * Created by Relvin Gonzalez on 8/15/2015.
 * Controller for the page that shows a single meeting
 */
meetingifyApp.controller('SingleController', ['SingleFactory','MeetingPublishFactory','$routeParams',function(SingleFactory,MeetingPublishFactory,$routeParams){
    var vm = this;
    localStorage['singleID'] = $routeParams.id;
    vm.meeting = SingleFactory.loadSingle();
    localStorage['meetingTopic'] = vm.meeting.topic;
    vm.deleteMeeting = SingleFactory.deleteMeeting;
    vm.editPermissions = vm.meeting.organizer == localStorage['current_user'];
    if(!navigator.onLine) {
        $('#publishButton').prop('disabled', true);
        $('#publishLink').attr('disabled', true);
        $('body').on('click', '#publishLink', function(event) {
            event.preventDefault();
        });
        vm.editPermissions = false;
    }
    vm.saveDraft = function(){
        vm.loading = 'true';
        MeetingPublishFactory.publishNow('save','',localStorage["singleID"]).then(function(data){
            vm.loading = 'false';
            vm.meeting.status = "pending";
        });
    }
    vm.createIcs = function(){
        MeetingPublishFactory.createIcs(vm.meeting);
    }
}]);