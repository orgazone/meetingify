/**
 * Created by Relvin Gonzalez on 10/28/2015.
 * Service used to re-login users once token expires
 */

meetingifyApp.factory('AuthenticationService',function(ApiCallService){
    function reLogIn(){
       return ApiCallService.apiCallLogIn(localStorage['user_email'],localStorage['userPass']);
    }

    function logIn(email,pass){
        return ApiCallService.apiCallLogIn(email,pass);
    }

    function showUser(token){
        return ApiCallService.apiCallShowUser(token);
    }

    return{
        logIn:logIn,
        reLogIn:reLogIn,
        showUser:showUser
    }

})
