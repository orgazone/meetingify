/**
 * Created by Relvin Gonzalez on 9/1/2015.
 */
meetingifyApp.controller('ModalInstanceController', ['MeetingPublishFactory','MeetingObjectFactory','MemberObjectFactory', '$modalInstance','$location',
    function(MeetingPublishFactory, MeetingObjectFactory,MemberObjectFactory, $modalInstance){
        var vm = this;
        vm.saving = false;
        vm.saveDraft = function(){
            vm.saving = true;
            MeetingPublishFactory.publishNow('save','',localStorage["singleID"]).then(function(data){
                vm.saving = false;
                $modalInstance.close("draft");
            });
        };

        vm.cancelModal = function(){
            $modalInstance.dismiss('cancel');
        }

        vm.forgetMeeting = function(){
                //get the meeting you want to forget
                var queryResult = meetingifyDB.queryAll("meetings", {
                    query: function(row) {
                        if(row.meetingid == localStorage["singleID"]) {
                            return true;
                        }
                    }
                });
                //if you find the meeting
                if(queryResult.length>0) {
                    //Create an object of this meeting
                    var myMeeting = new MeetingObjectFactory(
                        queryResult[0].ID,
                        meetingifyDB
                    );
                    //remove it
                    myMeeting.removeFromCloud(false).then(function(data){
                        $modalInstance.close("deleted");
                    });
                }
                else
                    $modalInstance.close("deleted");
        }
    }]);