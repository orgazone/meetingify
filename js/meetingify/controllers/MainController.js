/**
 * Created by Relvin Gonzalez on 8/14/2015.
 */
meetingifyApp.controller('MainController', ['GlobalVariablesService','SubscriptionModalFactory','CommonFunctions','$scope','$location',
    function(GlobalVariablesService,SubscriptionModalFactory,CommonFunctions,$scope,$location){
        var vm = this;
        vm.collapse = true;
        vm.fullName = GlobalVariablesService.getFullName;

        //if an html was returned from the log in
        if(localStorage['subscription_html']) {
            SubscriptionModalFactory.SubscriptionModal();
        }

        $scope.$on('$routeChangeStart', function(next, current) {
            vm.collapse = true;
        });

        vm.showHide = function(){
            if($location.path() === '/'||$location.path() === ''){
                return false;
            }
            else{
                return true;
            }
        }

        vm.logout = CommonFunctions.logout;
        vm.prepareNewMeeting = CommonFunctions.prepareNewMeeting;
    }]);
