/**
 * Created by Relvin Gonzalez on 9/4/2015.
 */
meetingifyApp.controller('OpenTodosController', ['OpenTodosFactory',function(OpenTodosFactory){
    var vm = this;
    vm.openTodos = OpenTodosFactory.loadOpenTodos();
    vm.markAsDone = OpenTodosFactory.markAsDone;
    vm.markAllAsDone = OpenTodosFactory.markAllAsDone;
}]);