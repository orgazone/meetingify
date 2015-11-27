/**
 * Created by Relvin Gonzalez on 8/17/2015
 * Factory used for functions of the single to dos view.
 */
meetingifyApp.factory('SingleTodoFactory', ['$q','TodoObjectFactory',function($q,TodoObjectFactory) {

    var saveTodo = function(selectedUser,deadline) {

        if (localStorage["mode"] == "new") {
            //todoContent, meetingId, userId, todoLocalId, todoUniqueId,status,tag,deadline
            var myTodo = new TodoObjectFactory(
                $("#todo_content").val(),
                localStorage["singleID"],
                selectedUser);
            myTodo.tag = "new";
            myTodo.deadline = deadline;
            myTodo.insertToLocalStorage(meetingifyDB);
            $('#edittodo').modal('hide');
        }
        else if (localStorage["mode"] == "edit") {
            var myTodo = new TodoObjectFactory(
                localStorage["todosID"],
                meetingifyDB);
            myTodo.todoContent = $("#todo_content").val();
            if(myTodo.tag == "old")
                myTodo.tag = "edit";
            myTodo.userId = selectedUser;
            myTodo.deadline = deadline;
            myTodo.updateToLocalStorage(meetingifyDB);
            $('#edittodo').modal('hide');
        }
    }

    var loadTodos = function(members){
        //get all results that have not been tagged for deletion
        var allTodos = new Array();
        angular.forEach(members,function(member){
            var todosArray = [];
            meetingifyDB.queryAll("todos", {
                sort: [["user_id", "ASC"]],
                query: function(row) {
                    if(row.meetingid == localStorage["singleID"] &&  row.tag != "del" && row.user_id == member.userid) {
                        todosArray.push(row);
                    }
                }
            });
            var membersAndTodos = {};
            membersAndTodos.member = member;
            membersAndTodos.todos = todosArray;
            allTodos.push(membersAndTodos);
        });
        return allTodos;
    }

    var loadMembers = function(){
        var queryResult =  meetingifyDB.queryAll("members", {
            sort: [["userid", "ASC"]],
            query: function(row) {
                if(row.meetingid == localStorage["singleID"] && row.tag != "del") {
                    return true;
                } else {
                    return false;
                }
            }
        });
        return queryResult;
    }

    var removeTodo = function(id,subId){
        if(localStorage["flag"] == "update_meeting") {
            var myTodo = new TodoObjectFactory(
                id,
                meetingifyDB
            );
            //if it is new then just delete it
            if(subId==0){
                myTodo.removeFromLocalStorage(meetingifyDB);
            }
            //else tag for deletion
            else{
                myTodo.tag = "del";
                myTodo.updateToLocalStorage(meetingifyDB);
            }

            //update the count
            meetingifyDB.update(
                "meetings",
                {meetingid: myTodo.meetingId},
                function(row){
                    row.todos_count = row.todos_count-1<0?0:row.todos_count-1;
                    return row;
                }
            );
            meetingifyDB.commit();
            return true;
        }
        return false;
    }

    var markAsDone = function(todo){
        var myTodo = new TodoObjectFactory(
            todo.ID,
            meetingifyDB
        );
        todo.status == "open"?todo.status = "completed":todo.status = "open";
        myTodo.status = todo.status;
        myTodo.tag = "edit";
        myTodo.updateToLocalStorage(meetingifyDB);
    }

    var getMeeting = function(){
        var meeting = meetingifyDB.queryAll("meetings",{query:{"meetingid":localStorage['singleID']}});
        return meeting[0];
    }

    return{
        saveTodo:saveTodo,
        loadTodos:loadTodos,
        loadMembers:loadMembers,
        removeTodo:removeTodo,
        markAsDone:markAsDone,
        getMeeting:getMeeting
    }
}]);
