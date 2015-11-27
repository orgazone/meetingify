/**
 * Created by Relvin Gonzalez on 8/17/2015.
 * Controller for the Single files view
 */
meetingifyApp.controller('SingleFilesController', ['SingleFilesFactory',function(SingleFilesFactory){
    var vm = this;
    //Load files and attach to scope to show on view
    vm.files = SingleFilesFactory.loadFiles();
    vm.topic = localStorage['meetingTopic'];
    vm.meetingId = localStorage['singleID'];
    vm.getOwnerName = getOwnerName;
    //getFullnameFromId(memberId, localDb)
    vm.uploadFile = function() {
        SingleFilesFactory.uploadFile();
        vm.files = SingleFilesFactory.loadFiles();
    }
    vm.downloadFile = function(file) {
        SingleFilesFactory.downloadFile(file);
    }
    vm.removeFile = function(id,subId){
        SingleFilesFactory.removeFile(id,subId);
        vm.files = SingleFilesFactory.loadFiles();
    }
}]);