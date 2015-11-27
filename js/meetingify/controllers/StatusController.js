/**
 * Created by Relvin Gonzalez on 8/15/2015.
 * Controller for the Status view
 */
meetingifyApp.controller('StatusController', [function(){
//
    var vm = this;
    if (navigator.onLine) {
        vm.connection = "online";
    } else {
        vm.connection = "offline"
    }
    vm.user = session[0]["first_name"] + " " + session[0]["last_name"];
    vm.last_sync = session[0]["last_synced"];
}]);
