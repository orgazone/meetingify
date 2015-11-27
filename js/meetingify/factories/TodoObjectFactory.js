/**
 * Created by Relvin Gonzalez on 8/21/2015
 * Creates To do Objects for use on any other factory
 *
 */
meetingifyApp.factory('TodoObjectFactory',['ApiCallService','$q' ,function(ApiCallService,$q){
//
//  todoContent: to do Content
//  meetingId : meeting Id
//  userId  : user ID of meeting creator
//  todoLocalId   :  ID of an todos on localstorage
//  todoUniqueId: ID of an todos on cloud


    var TodoObject = function(todoContent, meetingId, userId, todoLocalId, todoUniqueId,status,tag,deadline){
        if(arguments.length == 2){
            this.init(todoContent, meetingId);
        }
        else{
            this.todoContent = todoContent;
            this.meetingId = meetingId;
            this.userId = userId;
            this.todoLocalId = typeof todoLocalId!== 'undefined' ? todoLocalId : 0;
            this.todoUniqueId = typeof todoUniqueId !== 'undefined' ? todoUniqueId : 0;
            this.status = typeof status !== 'undefined' ? status : "open";
            this.tag = typeof tag !== 'undefined' ? tag : "";
            this.deadline = typeof deadline !== 'undefined' ? deadline : new Date();
        }

    }
    TodoObject.prototype.init = function(todoId, localDb){
        var self = this;
        localDb.queryAll ("todos", {
            query: function(row) {
                if(row.ID == todoId) {
                    self.todoLocalId = todoId;
                    self.todoContent = row.todos;
                    self.meetingId = row.meetingid;
                    self.userId = row.user_id;
                    self.todoUniqueId = row.todossub_id;
                    self.status = row.status;
                    self.deadline = row.deadline;
                    self.tag = row.tag;
                }
            }
        });
    }

    TodoObject.prototype.insertToLocalStorage = function (localDb){
        var todoId = localDb.insert("todos", {
            meetingid:this.meetingId,
            todossub_id: this.todoLocalId,
            user_id: this.userId,
            todos: this.todoContent,
            status: this.status,
            deadline: this.deadline,
            tag:this.tag
        });
        this.todoLocalId = todoId;
        var self = this;
        localDb.update(
            "meetings",
            {meetingid: this.meetingId},
            function(row){
                row.todos_count = row.todos_count+1;
                if((row.status=="published"||row.status=="pending") && self.tag!="old")
                    row.status="edited";
                return row;
            }
        );
        localDb.commit();
    }

    TodoObject.prototype.updateToLocalStorage = function (localDb){
        var self = this;
        localDb.update(
            "todos",
            { ID: this.todoLocalId },
            function (row) {
                row.todossub_id = self.todoUniqueId;
                row.todos = self.todoContent;
                row.meetingid = self.meetingId;
                row.user_id = self.userId;
                row.status = self.status;
                row.deadline = self.deadline;
                row.tag = self.tag;
                return row;
            }
        );
        localDb.update(
            "meetings",
            {meetingid: this.meetingId},
            function(row){
                if((row.status=="published"||row.status=="pending") && self.tag!="old")
                    row.status="edited";
                return row;
            }
        );
        localDb.commit();
    }

    TodoObject.prototype.updateToCloud = function (localDb) {
        var tododata = {};
        var self = this;
        tododata.OZINDEX = this.todoUniqueId;
        tododata.meetingid =this.meetingId;
        tododata.userid = this.userId;
        tododata.todos = this.todoContent;
        tododata.status = this.status;
        tododata.todossub_id = this.todoUniqueId;
        tododata.deadline = this.deadline;
        tododata.tag = this.tag;

        return ApiCallService.apiCall (
            "update",
            "meetingify",
            "todos",
            this.meetingId,
            tododata)
            .then(function (data) {
                self.updateToLocalStorage(localDb);
            });
    }

    TodoObject.prototype.insertToCloud = function (localDb){
        var tododata = {};
        var self = this;
        tododata.meetingid =this.meetingId;
        tododata.userid = this.userId;
        tododata.todos = this.todoContent;
        tododata.status = this.status;
        tododata.todossub_id = this.todoUniqueId;
        tododata.deadline = this.deadline;
        tododata.tag = this.tag;
        return ApiCallService.apiCall(
            "push",
            "meetingify",
            "todos",
            this.meetingId,
            tododata)
            .then(function(data){
                self.todoUniqueId = data.data.data.LASTID;
                return self.updateToCloud(localDb);
            });
    }

    TodoObject.prototype.removeFromLocalStorage = function (localDb){
        var self = this;
        localDb.deleteRows(
            "todos",
            {ID:this.todoLocalId}
        );
        localDb.commit();
    }

    TodoObject.prototype.removeFromCloud = function (localDb){
        var tododata = this.todoUniqueId;
        var self = this;
        return ApiCallService.apiCall(
            "delete",
            "meetingify",
            "",
            -1,
            this.todoUniqueId)
            .then(function(data){
                self.removeFromLocalStorage(localDb);
            });
    }
    return TodoObject;
}]);
