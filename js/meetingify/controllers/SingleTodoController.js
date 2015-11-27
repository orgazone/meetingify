/**
 * Created by Relvin Gonzalez on 8/17/2015.
 * Controller for the Single to do view
 * SingleTodoFactory service that has functions to load, remove and add to dos.
 */
meetingifyApp.controller('SingleTodoController', ['SingleTodoFactory',function(SingleTodoFactory) {
    var vm = this;
    vm.members = SingleTodoFactory.loadMembers();
    vm.todos = SingleTodoFactory.loadTodos(vm.members);
    vm.topic = localStorage['meetingTopic'];
    vm.meetingId = localStorage['singleID'];
    vm.meeting = SingleTodoFactory.getMeeting(vm.meetingId);
    vm.removeTodo = function(id,subId,length){
        if (confirm("Are you sure?")) {
            SingleTodoFactory.removeTodo(id, subId);
            vm.todos = SingleTodoFactory.loadTodos(vm.members);
            if(length==1)
                return false;
            else
                return true;
        }
        return true;
    }
    //Pre populate modal with content to edit
    vm.prepareEdit = function(todo){
        localStorage['mode'] = 'edit';
        localStorage['todosID'] = todo.ID;
        //set the modal default content
        vm.todoUser = todo.user_id;
        vm.todoContent = todo.todos;
        if(todo.deadline)
            vm.deadline = moment(new Date(todo.deadline)).format('L');
        else
            vm.deadline = moment(new Date(vm.meeting.start_date)).format('L');
    }
    //show clean modal
    vm.newTodo = function(){
        vm.todoContent = "";
        vm.deadline = moment(new Date(vm.meeting.start_date)).format('L');
        if(vm.members.length>0)
            vm.members[0].userid == 0 ? vm.todoUser =vm.members[0].ID.toString():vm.todoUser =vm.members[0].userid.toString();
    }
    //edit or add to do
    vm.saveTodo = function(form) {
        if(form.$valid) {
            SingleTodoFactory.saveTodo(vm.todoUser,vm.deadline);
            vm.todos = SingleTodoFactory.loadTodos(vm.members);
        }
        else{
            alert("Invalid form!");
        }
    }
    vm.markAsDone = SingleTodoFactory.markAsDone;

}])
