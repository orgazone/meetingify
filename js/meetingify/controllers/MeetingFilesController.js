/**
 * Created by Relvin Gonzalez on 8/18/2015.
 * Controller for the Meeting Files view
 */
meetingifyApp.controller('MeetingFilesController', ['MeetingFilesFactory','OnBreakFactory','$scope', function(MeetingFilesFactory,OnBreakFactory, $scope){
    var vm = this;
    //Load files and attach to scope to show on view
    vm.files = MeetingFilesFactory.loadFiles();

    vm.getFullName = getOwnerName;
    vm.localDB = meetingifyDB;
    //getFullnameFromId(memberId, localDb)
    //upload File
    vm.uploadFile = function() {
        MeetingFilesFactory.uploadFile();
        vm.files = MeetingFilesFactory.loadFiles();
    }
    vm.downloadFile = function(file) {
        MeetingFilesFactory.downloadFile(file);
    }
    vm.removeFile = function(id,subId){
        if(MeetingFilesFactory.removeFile(id,subId)){
            vm.files = MeetingFilesFactory.loadFiles();
        }
    }
    if(!navigator.onLine) {
        $('#publishButton').prop('disabled', true);
        $('#publishLink').attr('disabled', true);
        $('body').on('click', '#publishLink', function(event) {
            event.preventDefault();
        });
    }
    //modal
    if(navigator.onLine) {
        var onBreakModal = new OnBreakFactory($scope);
        onBreakModal.navigateAway();
    }
}])

