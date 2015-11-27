/**
 * Created by Relvin Gonzalez on 10/6/2015.
 */
meetingifyApp.controller('SubscriptionModalController', ['$modalInstance', function( $modalInstance){
    var vm = this;
    vm.template = localStorage['subscription_html'];
    vm.cancelModal = function(){
        $modalInstance.dismiss('cancel');
    }
}]);
