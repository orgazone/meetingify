/**
 * Created by Relvin Gonzalez on 8/18/2015.
 * Controller for the Meeting Participants view
 */
meetingifyApp.controller('MeetingParticipantsController', ['MeetingParticipantsFactory','OnBreakFactory','$scope', function(MeetingParticipantsFactory, OnBreakFactory, $scope){
    var vm = this;
    vm.participants = MeetingParticipantsFactory.loadParticipants();
    vm.editName = "";
    vm.editEmail = "";
    vm.prepareEdit = function(id,name,email){
        localStorage['mode'] = 'edit';
        localStorage['participantID'] = id;
        //set the modal default content
        vm.editName = name;
        vm.editEmail = email;
    };
    vm.newParticipant = function(){
        vm.editName = "";
        vm.editEmail = "";
        vm.nameAndEmail = "";
    };
    //remove function
    vm.removeParticipants = function(id,subId){
        if(MeetingParticipantsFactory.removeParticipants(id,subId)) {
            //reload participants after remove
            vm.participants = MeetingParticipantsFactory.loadParticipants();
        }
    };
    //save operation
    vm.save = function(form) {
        //validate form before submitting
        if (form.$valid) {
            MeetingParticipantsFactory.saveOperations(vm.nameAndEmail);
            //reload participants after save
            vm.participants = MeetingParticipantsFactory.loadParticipants();
            $('#editmod').modal('hide');

        } else {
            alert("There are invalid fields");
        }
    };
    if(navigator.onLine) {
        var onBreakModal = new OnBreakFactory($scope);
        onBreakModal.navigateAway();
    }
}]);
