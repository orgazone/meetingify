/**
 * Created by Relvin Gonzalez on 10/06/2015.
 * Directive that shows the html of the subscription modal.
 */
meetingifyApp.directive('ngSubscriptionHtml', function($compile){
    'use strict';
    return {
        restrict: 'E',
        scope:{
            subscriptionTemplate: '='
        },
        link: function(scope, element, attrs) {
            var el = $compile('<div>'+scope.subscriptionTemplate+'</div>')(scope);
            element.replaceWith(el);
        }
    };
});
