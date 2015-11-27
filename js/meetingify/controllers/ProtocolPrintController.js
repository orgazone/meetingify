/**
 * Created by Relvin Gonzalez on 9/17/2015.
 * Controller for the protocol print template view
 */
meetingifyApp.controller('ProtocolPrintController', ['SingleFactory','SingleParticipantsFactory','SingleNoteFactory','SingleTodoFactory','SingleFilesFactory',
    function(SingleFactory,SingleParticipantsFactory,SingleNoteFactory,SingleTodoFactory,SingleFilesFactory){
        var vm = this;
        vm.meeting = SingleFactory.loadSingle();
        vm.members = SingleParticipantsFactory.loadParticipants();
        vm.getOwnerName = getOwnerName;
        vm.notes = SingleNoteFactory.loadNotes();
        vm.todos = SingleTodoFactory.loadTodos(vm.members);
        vm.files = SingleFilesFactory.loadFiles();
    }]);
