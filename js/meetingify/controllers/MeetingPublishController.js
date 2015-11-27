/**
 * Created by Relvin Gonzalez on 8/18/2015.
 * Controller for the Meeting Publish view
 */
meetingifyApp.controller('MeetingPublishController', ['MeetingPublishFactory','OnBreakFactory','$scope',
    function(MeetingPublishFactory,OnBreakFactory, $scope){
        var vm = this;
        if(navigator.onLine) {
            vm.calendarInfo = MeetingPublishFactory.prepareCalendar();
            vm.publishNow = MeetingPublishFactory.publishNow;
            vm.publishNow('publish','',localStorage["singleID"]);
            vm.progressValue = MeetingPublishFactory.getProgressValue;
            vm.progressColor = MeetingPublishFactory.getProgressColor;
            vm.progressStatus = MeetingPublishFactory.getProgressStatus;
            var onBreakModal = new OnBreakFactory($scope);
            onBreakModal.navigateAway();
        }
        else{
            alert("Can't publish now. Working offline.");
        }
    }]);
