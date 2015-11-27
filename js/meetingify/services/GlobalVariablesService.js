/**
 * Created by Relvin Gonzalez on 9/24/2015.
 */
meetingifyApp.service('GlobalVariablesService',function(){
    var fullName = " ";
    var interceptorSwitch = true;

    return {
        getFullName: function(){
            return fullName;
        },
        setFullName:function(name){
            fullName = name;
        },
        getInterceptorSwitch: function(){
            return interceptorSwitch;
        },
        setInterceptorSwitch:function(newValue){
            interceptorSwitch = newValue ;
        }
    }
})
