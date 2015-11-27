/**
 * Created by Relvin Gonzalez on 8/18/2015.
 * Controller for the Meeting Participants view
 */
meetingifyApp.controller('MeetingAgendaController', ['MeetingAgendaFactory','OnBreakFactory','$scope', function(MeetingAgendaFactory,OnBreakFactory,$scope){
    var vm = this;
    //load agendas
    vm.agendas = MeetingAgendaFactory.loadAgendas();
    vm.members = MeetingAgendaFactory.loadMembers();
    var meetingStartDate = MeetingAgendaFactory.getMeeting().start_date;
    vm.getOwnerName = getOwnerName;
    vm.prepareEdit = function(agenda){
        localStorage['mode'] = 'edit';
        localStorage['agendaID'] = agenda.ID ;
        localStorage['agendasubID'] = agenda.agendasub_id;
        vm.agendaContent = agenda.agenda;
        vm.agendaOwner = agenda.owner_id;
        vm.agendaFrom = new Date(agenda.start_time);
        vm.agendaTo = new Date(agenda.end_time);
    }
    //when new note show empty modal
    vm.newAgenda = function(){
        var startTime = new Date(meetingStartDate);
        formatAgendaDate(startTime);
        var endTime = new Date(meetingStartDate);
        formatAgendaDate(endTime);

        vm.agendaContent = "";
        vm.agendaFrom = startTime;
        vm.agendaTo = endTime;

        var fromTime = vm.agendaFrom.getTime();
        vm.agendaTo.setTime(fromTime + 15*60000);
        vm.agendaOwner = "";
    }
    //attach remove method
    vm.saveAgenda = function(form) {
        if(form.$valid) {
            //toIsoString needed when creating a new entry to see the changes instantly.
            // It saves the string rather than the date object
            var agenda = {
                start_time :vm.agendaFrom.toISOString(),
                end_time : vm.agendaTo.toISOString(),
                owner_id : vm.agendaOwner,
                agenda : vm.agendaContent
            };
            MeetingAgendaFactory.saveOperations(agenda);
            vm.agendas = MeetingAgendaFactory.loadAgendas();
        }
        else{
            alert("Form is invalid!");
        }
    }

    //attach remove method
    vm.removeAgenda = function(id,subId){
        if(MeetingAgendaFactory.removeAgenda(id,subId)){
            vm.agendas = MeetingAgendaFactory.loadAgendas();
        }
    }
    vm.changeDate = function(){
        vm.agendaTo = vm.agendaFrom>vm.agendaTo?vm.agendaFrom:vm.agendaTo;
    }
    function formatAgendaDate(date){
        date.setMilliseconds(0);
        date.setSeconds(0);
    }

    if(navigator.onLine) {
        var onBreakModal = new OnBreakFactory($scope);
        onBreakModal.navigateAway();
    }
}]);