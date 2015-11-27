/**
 * Created by Relvin Gonzalez on 9/1/2015.
 * Factory for the modal that is shown when the user navigates away from the creation process of a meeting
 */
meetingifyApp.factory('OnBreakFactory',['$modal','$location', function($modal,$location) {
    function Factory ($scope){
        this.scope = $scope
    }
    Factory.prototype.navigateAway = function() {
        var onRouteChangeOff;
        var self = this;
        function init(){
            onRouteChangeOff =  self.scope.$on('$locationChangeStart', routeChange);
        };

        init();

        function routeChange(event, next, current) {
            var cRoute = current.match((/#.+/g))[0]; //get the current route
            var nRoute = next.match(/#.+/g)[0];  //get the next route
            //If the user is navigating away, rather than continuing, show modal.
            if(!((cRoute==='#/meeting_basics'&&nRoute==='#/meeting_participants')||
                (cRoute==='#/meeting_participants'&&nRoute==='#/meeting_agenda')||
                (cRoute==='#/meeting_agenda'&&nRoute==='#/meeting_files')||
                (cRoute==='#/meeting_files'&&nRoute==='#/meeting_publish')||
                (cRoute==='#/meeting_publish'))
                ||(cRoute==='#/meeting_publish'&&nRoute==='#/meeting_files')) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'js/meetingify/views/navigate_away.html',
                    controller: 'ModalInstanceController',
                    controllerAs: 'ModalInstanceCtrl',
                    size: ''
                })
                modalInstance.result.then(function (result) {
                    if (result === 'draft') {
                        onRouteChangeOff();//stop watching locationchange event
                        var next_route = nRoute.match(/\/.*/g)[0]; //remove the number sign #
                        $location.path(next_route); //Go to page they're interested in
                    }
                    else if (result === 'deleted') {
                        onRouteChangeOff();
                        var next_route = nRoute.match(/\/.*/g)[0]; //remove the number sign #
                        $location.path(next_route);
                    }
                });
                event.preventDefault();
            }
            return false;
        };
    }

    return Factory;
}]);
