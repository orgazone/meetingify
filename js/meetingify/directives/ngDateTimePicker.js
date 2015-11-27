/**
 * Created by Relvin Gonzalez on 9/23/2015.
 * Directive to show datetimepicker
 * model = ng-model
 * disabled = ng-disabled
 * meetingDate = meeting-date  , to set meeting set in the case that you need a default starting date
 */
'use strict';
meetingifyApp.directive('ngDateTimePicker', function () {
    var format = 'MM/DD/YYYY hh:mm A';

    return {
        restrict: 'A',
        require:'ngModel',
        scope:{
            meetingDate:'=',
            model:'=ngModel',
            disabled:'=ngDisabled'
        },
        template:'<input type="text" id="meetDate" class="form-control" name="dateTime" required ng-model="model" ng-disabled="disabled"/>'
                  +'<span class="input-group-addon">'
                  +'<span class="glyphicon glyphicon-calendar"></span>'
                  +'</span>',
        link: function (scope, element, attrs,ctrl) {
            var pickerType = attrs.pickerType;
            if(pickerType=='dateTime'){
                element.datetimepicker({
                        useCurrent:true,
                        allowInputToggle:true,
                        showClose:true,
                        toolbarPlacement:'top'});
            }
            else if(pickerType=='date'){
                element.datetimepicker({
                        allowInputToggle:true,
                        showClose:true,
                        toolbarPlacement:'top',
                        minDate:new Date(scope.meetingDate),
                        defaultDate:new Date(scope.meetingDate),
                        format: 'MM/DD/YYYY'
                })
            }
            element.on("dp.change", function(e){
                    scope.$apply(function(){
                        var format = pickerType === 'dateTime'?"MM/DD/YYYY h:mm A":"MM/DD/YYYY";
                        ctrl.$setViewValue(e.date.format(format));
                    });
            })
        }
    };
});