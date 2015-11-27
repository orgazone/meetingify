/**
 * Created by Relvin Gonzalez on 8/15/2015.
 * Controller calls for factory function which takes care of all view operations
 */
meetingifyApp.controller('SingleAgendaController', ['SingleAgendaFactory','$window',function(SingleAgendaFactory,$window){
    var vm = this;
    //load agendas
    vm.agendas = SingleAgendaFactory.loadAgendas();
    vm.topic = localStorage['meetingTopic'];
    vm.members = SingleAgendaFactory.loadMembers();
    vm.meetingId = localStorage['singleID'];
    var meetingStartDate = SingleAgendaFactory.getMeeting().start_date;

    vm.getOwnerName = getOwnerName;
    vm.prepareEdit = function(agenda){
        localStorage['mode'] = 'edit';
        localStorage['agendaID'] = agenda.ID ;
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
    //attach all other operations
    vm.saveAgenda = function(form) {
        //validate form before attempting to save
        if(form.$valid) {
            //toIsoString needed when creating a new entry to see the changes instantly.
            // It saves the string rather than the date object
            var agenda = {
                start_time :vm.agendaFrom.toISOString(),
                end_time : vm.agendaTo.toISOString(),
                owner_id : vm.agendaOwner,
                agenda : vm.agendaContent
            };
            SingleAgendaFactory.saveAgenda(agenda);
            vm.agendas = SingleAgendaFactory.loadAgendas();
        }
        else{
            alert("Form is invalid!");
        }
    }
    //attach remove method
    vm.removeAgenda = function(id,subId){
        if(SingleAgendaFactory.removeAgenda(id,subId)){
            vm.agendas = SingleAgendaFactory.loadAgendas();
        }
    }
    vm.changeDate = function(){
        vm.agendaTo = vm.agendaFrom>vm.agendaTo?vm.agendaFrom:vm.agendaTo;
    }

    function formatAgendaDate(date){
        date.setMilliseconds(0);
        date.setSeconds(0);
    }
}]);