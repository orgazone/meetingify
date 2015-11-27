/**
 * Created by Relvin Gonzalez on 8/17/2015.
 * Controller for the Single note view
 */
meetingifyApp.controller('SingleNoteController', ['SingleNoteFactory','$scope',function(SingleNoteFactory,$scope) {
    var vm = this;
    vm.notes = SingleNoteFactory.loadNotes();
    vm.topic = localStorage['meetingTopic'];
    vm.meetingId = localStorage['singleID'];
    //method in common.js to get email from user id
    vm.getEmail = getEmailFromId;
    //when editing a note show modal with information
    vm.setEditNote = function(id,note,isPublic){
        localStorage['mode'] = 'edit';
        localStorage['noteID'] = id;
        vm.noteContent = note;
        vm.isPublic = isPublic;
    }
    //when new note show empty modal
    vm.newNote = function(){
        vm.noteContent = "";
        vm.isPublic = false;
    }
    vm.removeNote = function(id,subId){
        SingleNoteFactory.removeNote(id,subId);
        vm.notes = SingleNoteFactory.loadNotes();
    }
    //prepare page functions
    vm.saveNote = function(form) {
        if(form.$valid) {
            SingleNoteFactory.saveNote(vm.isPublic);
            //reload list of notes after saving
            vm.notes = SingleNoteFactory.loadNotes();
        }
        else{
            alert("Invalid form!");
        }
    };
}]);
