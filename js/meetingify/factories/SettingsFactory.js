/**
 * Created by Relvin Gonzalez on 8/18/2015
 * Factory used for functions of the settings view.
 * It has functions to populate fields and update information
 */
meetingifyApp.factory('SettingsFactory',['ApiCallService','GlobalVariablesService','$location','$translate', function(ApiCallService,GlobalVariablesService,$location,$translate) {

    //save the settings
    var saveSettings = function(settings) {
        var appdata={};
        appdata.firstname = settings.user_firstname;
        appdata.lastname = settings.user_lastname;
        appdata.nickname  = "";
        $("#loading").show();

        //apiCall(appaction, appname, appsortstr, appsortint, token, appdata)
        ApiCallService.apiCall(
            "updateuser",
            "meetingify",
            "",
            this.meetingId,
            appdata)
            .then(function(data){
                var result  = data;
                $("#loading").hide();
                meetingifyDB.update("session", {ID: 1}, function(row) {
                    row.logged_in = 1;
                    row.user_email = settings.user_email;
                    row.first_name = settings.user_firstname;
                    row.last_name = settings.user_lastname;
                    row.locale = settings.locale;
                    return row;
                });
                meetingifyDB.commit();

                session[0]["first_name"]= settings.user_firstname;
                session[0]["last_name"] = settings.user_lastname;
                session[0]["locale"] = settings.locale;

                GlobalVariablesService.setFullName(settings.user_firstname + " " + settings.user_lastname);

                $translate.use(settings.locale);

                $location.path('/main');
            },
            function(error){
                $("#loading").hide();
            }
        );

    }

    //load settings into controller
    var loadSettings = function(){
        var settings ={};
        settings.user_email = session[0]["user_email"];
        settings.user_firstname = session[0]["first_name"];
        settings.user_lastname = session[0]["last_name"];
        settings.locale = session[0]["locale"];
        return settings;
    }

    return{
        saveSettings:saveSettings,
        loadSettings:loadSettings
    }
}]);
