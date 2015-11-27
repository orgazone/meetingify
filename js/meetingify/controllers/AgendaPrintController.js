/**
 * Created by Relvin Gonzalez on 9/17/2015.
 * Controller that takes care of the agenda print template view
 */
meetingifyApp.controller('AgendaPrintController', ['SingleFactory','SingleParticipantsFactory','SingleAgendaFactory',
    function(SingleFactory,SingleParticipantsFactory,SingleAgendaFactory){
        var vm = this;

        vm.meeting = SingleFactory.loadSingle();
        vm.members = SingleParticipantsFactory.loadParticipants();
        vm.agendas = SingleAgendaFactory.loadAgendas();
        vm.getOwnerName = getOwnerName;

    }]);