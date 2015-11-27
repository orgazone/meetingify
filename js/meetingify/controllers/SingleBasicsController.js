/**
 * Created by Relvin Gonzalez on 8/14/2015.
 */
meetingifyApp.controller('SingleBasicsController', ['SingleBasicsFactory','$sce',function(SingleBasicsFactory,$sce){
    var vm = this;
    var strUrl1="https://www.google.com/maps/embed/v1/search?q=";
    var strKey="&key=AIzaSyBSGflnNOErs374V-ggWTSr6sWa53tyDIE";

    //populate meeting values
    vm.meeting = SingleBasicsFactory.meeting();
    vm.meetingId = localStorage['singleID'];
    vm.editPermissions = vm.meeting.organizer == localStorage['current_user'];
    //Change map as user types
    vm.mapSrc = " ";
    //function to handle changes on map field
    vm.setMapOnChange = function() {
        var centerOfMap = vm.meeting.location;
        setMapUrl(centerOfMap);
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
    vm.save = function(form){
        if(form.$valid) {
            SingleBasicsFactory.saveMeeting(vm.meeting);
        }
    }
}]);

