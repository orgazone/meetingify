/**
 * Created by Relvin Gonzalez on 10/15/2015.
 *
 * This interceptor injects the token into http requests.
 * On an authentication or token error(responseError), it re-logins the user automatically and tries the request again.
 */
meetingifyApp.factory('AuthorizationInterceptor', function($q,$injector,$templateCache,GlobalVariablesService,CommonFunctions){
        return {
            'request': function (config) {
                config.params = config.params || {};
                var useInterceptor = GlobalVariablesService.getInterceptorSwitch();
                if(session[0]) {
                    if (session[0]["token"] && $templateCache.get(config.url) === undefined && useInterceptor) {
                        config.params.token = session[0]["token"];
                    }
                }
                GlobalVariablesService.setInterceptorSwitch(true);
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    if(session[0]) {
                        return $injector.invoke(function (AuthenticationService) {
                            return AuthenticationService.reLogIn().then(function (data) {
                                session[0]["token"] = data.data.token;
                                localStorage['subscription_html'] = data.data.alert;
                                return $injector.get('$http')(response.config);
                            });
                        })
                    }
                    else{
                        CommonFunctions.logout();
                    }
                }
                return $q.reject(response);
            }
        };
    })
