/**
 * Created by Relvin Gonzalez on 8/28/2015.
 * Controller for the single publish view. Takes care of publishing existing meetings via the single page.
 */
meetingifyApp.controller('SinglePublishController', ['MeetingPublishFactory', function(MeetingPublishFactory){
    var vm = this;
    vm.topic = localStorage['meetingTopic'];
    vm.meetingId = localStorage['singleID'];
    if(navigator.onLine) {
        vm.calendarInfo = MeetingPublishFactory.prepareCalendar();
        MeetingPublishFactory.publishNow("publish",'',localStorage["singleID"]);
        vm.progressValue = MeetingPublishFactory.getProgressValue;
        vm.progressColor = MeetingPublishFactory.getProgressColor;
        vm.progressStatus = MeetingPublishFactory.getProgressStatus;
    }
    else{
        alert("Can't publish now. Working offline.");
    }

}]);
