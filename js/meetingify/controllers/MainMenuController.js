/**
 * Created by Relvin Gonzalezon 9/24/2015.
 */
meetingifyApp.controller('MainMenuController',['CommonFunctions',function(CommonFunctions){
    var vm = this;
    vm.meetings_count = 0;
    vm.meetings_changed_count = 0;
    //get pending and edited meetings and count them
    meetingifyDB.queryAll("meetings", {
        query: function(row) {
            if(row.status ==  "pending" || row.status == "edited") {
                vm.meetings_changed_count +=1;
            }
            vm.meetings_count +=1;
        }
    });

    var count = meetingifyDB.rowCount('agenda',{
        meetingid : localStorage['singleID']
    })

    vm.prepareNewMeeting = CommonFunctions.prepareNewMeeting;
}])