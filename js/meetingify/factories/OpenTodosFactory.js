/**
 * Created by Relvin Gonzalez on 9/4/2015.
 */
meetingifyApp.factory('OpenTodosFactory',['TodoObjectFactory', function(TodoObjectFactory) {

    var loadOpenTodos = function(){
        var allOpenTodos = new Array();

        //find all meetings
        var queryResult =  meetingifyDB.queryAll("meetings", {
            sort: [["start_date", "DESC"]]
        });

        //find all todos per meeting
        for(var i =0;i<queryResult.length;i++){
            var todosArray = [];
            var hasTodos = false;
            meetingifyDB.queryAll("todos", {
                query: function(row) {
                   if(row.meetingid == queryResult[i].meetingid && row.tag != 'del'){
                       if(getEmailFromId(row.user_id,meetingifyDB)==localStorage['user_email']) {
                           todosArray.push(row);
                           hasTodos = true;
                       }
                   }
                }
            });
            if(hasTodos) {//avoid adding meetings without todos
                var meetingAndTodos = {};
                meetingAndTodos.meeting = queryResult[i];
                meetingAndTodos.todosArray = todosArray;
                allOpenTodos.push(meetingAndTodos);
            }
        }
        return allOpenTodos;
    }
    var markAsDone = function(todo,all){
        var myTodo = new TodoObjectFactory(
            todo.ID,
            meetingifyDB
        );
        if(all)
            todo.status = "completed"
        else
            todo.status == "open"?todo.status = "completed":todo.status = "open";
        myTodo.status = todo.status;
        myTodo.tag = "edit";
        myTodo.updateToLocalStorage(meetingifyDB);
    }

    var markAllAsDone = function(todos){
        todos.forEach(function(todo) {
            markAsDone(todo,"all");
        })
    }


    return {
        loadOpenTodos:loadOpenTodos,
        markAsDone:markAsDone,
        markAllAsDone:markAllAsDone
    }
}]);