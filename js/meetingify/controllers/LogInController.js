/**
 * Created by Relvin Gonzalez on 11/19/2015.
 */
meetingifyApp.controller('LogInController',function(LogInFactory){
    var vm = this;
    vm.email = "";
    vm.pass="";
    vm.logIn = function(form){
        if(form.$valid) {
            $('#loginmod').modal('hide');
            LogInFactory.logIn(vm.email, vm.pass);
        }
        else
            alert("Form is invalid!");
    }
});
