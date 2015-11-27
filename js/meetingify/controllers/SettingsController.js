/**
 * Created by Relvin Gonzalez on 8/14/2015.
 */
meetingifyApp.controller('SettingsController', ['$scope','SettingsFactory','CommonFunctions','$location',
    function($scope,SettingsFactory,CommonFunctions,$location){
    var vm = this;
    vm.settings = SettingsFactory.loadSettings();
    vm.disable = false;
    vm.saveSettings = function(form){
        if(form.$valid) {
            SettingsFactory.saveSettings(vm.settings);
        }
        else{
            alert("Invalid values!");
        }
    }
    if(!navigator.onLine) {
        vm.disable = true;
    }
    vm.clearLocalStorage = function(){
        CommonFunctions.clearMeetingifyLocalDB();
        CommonFunctions.logout();
    }
    vm.go = function(path){
        $location.path(path);
    }

    $scope.$watch(function () {
        return session[0]['locale'];
    }, function (value) {
        vm.settings.locale = value;
    });
}]);