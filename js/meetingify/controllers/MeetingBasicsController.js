/**
 * Created by Relvin Gonzalez on 8/14/2015.
 * Controller for meeting basics view. Used when creating a new meeting.
 */
meetingifyApp.controller('MeetingBasicsController',['MeetingBasicsFactory','OnBreakFactory','$scope','$sce',function(MeetingBasicsFactory,OnBreakFactory,$scope,$sce){
    //variables for the map
    var strUrl1="https://www.google.com/maps/embed/v1/search?q=";
    var strKey="&key=AIzaSyBSGflnNOErs374V-ggWTSr6sWa53tyDIE";
    //local scope
    var vm = this;
    vm.loading = false;
    vm.meeting = MeetingBasicsFactory.getMeeting();
    //function to handle changes on map field
    vm.setMapOnChange = function() {
        var centerOfMap = vm.meeting.location;
        setMapUrl(centerOfMap);
    }
    vm.save = function(form){
        vm.loading = true;
        if(form.$valid) {
            MeetingBasicsFactory.saveMeeting(vm.meeting);
        }
        vm.loading = false;
    }
    function setMapUrl(center){
        var zoom="";
        if(!center) {
            //if it is empty, put a center
            center = "0,0"; //center of the world
            zoom = "&zoom=2";
        }
        vm.mapSrc = $sce.trustAsResourceUrl(strUrl1 + encodeURI(center) +zoom+strKey);
    }
    if(navigator.onLine) {
        var onBreakModal = new OnBreakFactory($scope);
        onBreakModal.navigateAway();
    }
}]);
