/**
 * Created by Relvin Gonzalez on 11/17/2015.
 * Directive to handle the language toggle switch
 * Watches any changes in language preferences
 */
'use strict';
meetingifyApp.directive('ngTranslate', function ($translate) {
    return {
        restrict: 'A',
        templateUrl:'js/meetingify/views/languagetoggle.html',
        link: function (scope, element, attrs) {
            if(session[0]) {
                scope.language = session[0]['locale'];

                scope.$watch(function () {
                    return session[0]['locale'];
                }, function (value) {
                    scope.language = value;
                });
            }
            else{
                scope.language = localStorage['locale']?localStorage['locale']:'en';
            }

            scope.translate = function(lang){
                if(lang!=scope.language) {
                    if(session[0]) {
                        session[0]['locale'] = lang;

                        meetingifyDB.update("session", {ID: 1}, function (row) {
                            row.locale = lang;
                            return row;
                        });
                        meetingifyDB.commit();
                    }
                    else{
                        localStorage['locale'] = lang;
                    }

                    $translate.use(lang);
                    scope.language = lang;
                }
            }
        }
    };
});
