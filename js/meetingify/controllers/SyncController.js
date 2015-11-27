/**
 * Created by Relvin Gonzalez on 8/15/2015.
 */
meetingifyApp.controller('SyncController', ['SyncFactory','$location',function(SyncFactory,$location){
    var vm = this;
    if(navigator.onLine) {
        vm.allDone = false;
        SyncFactory.syncAll().then(function(data){
            //remove loading spinner;
            vm.allDone = true;
            $location.path('/meetings');
        }).catch(function(error){
            alert(error);
        });
        vm.loadingText=SyncFactory.getLoadingText;
        vm.loadingMeeting=SyncFactory.getLoadingMeeting;
    }
    else{
        alert("Can't sync. Working offline.");
    }
}]);
