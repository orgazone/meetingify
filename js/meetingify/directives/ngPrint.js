/**
 * Created by Relvin Gonzalez on 9/16/2015.
 * Expanding/modifying Gil Fink's ngPrint directive.
 */
meetingifyApp.directive('ngPrint', ['$compile','$timeout','$window',function($compile,$timeout,$window){
    'use strict';
    var printSection = document.getElementById('printSection');
    // if there is no printing section, create one
    if (!printSection) {
        printSection = document.createElement('div');
        printSection.id = 'printSection';
        printSection.setAttribute("style","width:100%");//print full page
    }
    document.body.appendChild(printSection);

    function link(scope, element, attrs) {
        element.on('click', function () {
            var template = attrs.printTemplate;
            //print template full page
            var html = "<div style=\"width:100%\" ng-include=\""+template+"\"></div>";

            var el = angular.element(document.getElementById('printSection'));

            el.html(html);
            $compile(el)(scope);
            scope.$apply();
            //wait for the digest to complete in order to print,
            // or else a blank page will show on first try.
            $timeout(function(){
                $window.print();
            },100,false);
        });
        window.onafterprint = function () {
            // clean the print section before adding new content
            printSection.innerHTML = '';
        }
    }
    return {
        link: link,
        restrict: 'A'
    };
}]);