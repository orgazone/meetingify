/**
 * Created by Relvin Gonzalez on 10/6/2015.
 */

meetingifyApp.factory('SubscriptionModalFactory',['$modal','$interval','$modalStack', function($modal,$interval,$modalStack) {
    var modalInstance = "Begin";

    function SubscriptionModal(){

        $interval(OpenModal,5*60*1000);

        function OpenModal() {
            if(!$modalStack.getTop())
                modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'js/meetingify/views/subscription.html',
                    controller: 'SubscriptionModalController',
                    controllerAs: 'SubscriptionModalCtrl',
                    size: ''
                })
        }
        //OpenModal();
    }

    return {SubscriptionModal:SubscriptionModal};
}])