/**
 * Created by Relvin Gonzalez on 8/17/2015.
 */
meetingifyApp.controller('SingleParticipantsController', ['SingleParticipantsFactory',function(SingleParticipantsFactory){
    var vm = this;
    //load the participants
    vm.participants = SingleParticipantsFactory.loadParticipants();
    vm.topic = localStorage['meetingTopic'];
    vm.meetingId = localStorage['singleID'];
    //prepare to edit a participant
    vm.prepareEdit = function(id,name,email){
        localStorage['mode'] = 'edit';
        localStorage['participantID'] = id;
        //set the modal default content
        vm.editName = name;
        vm.editEmail = email;
    }
    vm.newParticipant = function(){
        vm.editName = "";
        vm.editEmail = "";
        vm.nameAndEmail = "";
    }
    //remove function
    vm.removeParticipants = function(id,subId){
        SingleParticipantsFactory.removeParticipants(id,subId);
            //reload participants after remove
        vm.participants = SingleParticipantsFactory.loadParticipants();

    };
   //save operation
    vm.save = function(form) {
        //validate form before submitting
        if (form.$valid) {
            SingleParticipantsFactory.saveOperations(vm.nameAndEmail);
                //reload participants after save
            vm.participants = SingleParticipantsFactory.loadParticipants();
        } else {
            alert("There are invalid fields");
        }
    }
}]);
