/**
 * Creatd by Relvin Gonzalez
 * This is the code for the AngularJs implementation
 * It uses the app name, and injects the ngRoute dependency for page routing
 */
var meetingifyApp = angular.module('Meetingify',['ngRoute','ngTagsInput','ui.bootstrap','ngAnimate','pascalprecht.translate']);
var apiURL = "https://apps.orga.zone/apiv2/";
var appCache = window.applicationCache;
var meetingifyDB = new localStorageDB("meetingify", localStorage);
var meetingifytempDB  = new localStorageDB("tempdb", localStorage);
var session = "";
var meetingTopic = " ";

/**
 * Configure the routing of the app.
 * controller: controller used in the view, needs to be included in the main page.
 * templateUrl: the url of the partial view
 */

meetingifyApp.config(['$translateProvider', function ($translateProvider) {
    //Everything kicks off here
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "1500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
    createDB();
    session = meetingifyDB.queryAll("session",{query:{ID:1}});

    function createDB(){

        // Check if the database was just created. Useful for initial database setup
        if( meetingifyDB.isNew() ) {
            meetingifyDB.createTable("session", ["user_id", "first_name", "last_name", "user_email", "confirmed", "meetings_count", "open_meetings", "closed_meetings", "last_synced", "last_logged_in", "member_since", "logged_in", "is_subscribed","token","locale"]);
            meetingifyDB.createTable("meetings", ["organizer","localid","meetingid","topic", "start_date", "date_created", "location", "kind", "members_count", "agenda_count", "files_count", "notes_count", "todos_count", "status","tag"]);
            meetingifyDB.createTable("members", ["meetingid", "userid", "fullname", "user_email", "confirmed","invited","tag"]);
            meetingifyDB.createTable("agenda", ["meetingid", "agendasub_id", "user_id", "owner_id","start_time","end_time","agenda","tag"]);
            meetingifyDB.createTable("files", ["meetingid", "filessub_id", "user_id", "file", "filename", "url","fullname","tag"]);
            meetingifyDB.createTable("todos", ["meetingid", "todossub_id", "user_id", "todos","status","deadline","tag"]);
            meetingifyDB.createTable("notes", ["meetingid", "notesub_id", "user_id", "note", "user_email", "is_public","tag"]);
            meetingifyDB.commit();
        }
        if( meetingifytempDB.isNew() ) {
            meetingifytempDB.createTable("session", ["user_id", "first_name", "last_name", "user_email", "confirmed", "meetings_count", "open_meetings", "closed_meetings", "last_synced", "last_logged_in", "member_since", "logged_in", "is_subscribed","token","locale"]);
            meetingifytempDB.createTable("meetings", ["organizer","localid","meetingid","topic", "start_date", "date_created", "location", "kind", "members_count", "agenda_count", "files_count", "notes_count", "todos_count","tag"]);
            meetingifytempDB.createTable("members", ["meetingid", "userid", "fullname", "user_email", "confirmed","invited","tag"]);
            meetingifytempDB.createTable("agenda", ["meetingid", "agendasub_id", "user_id", "owner_id","start_time","end_time", "agenda","tag"]);
            meetingifytempDB.createTable("files", ["meetingid", "filessub_id", "user_id","file", "filename", "url","fullname","tag"]);
            meetingifytempDB.createTable("todos", ["meetingid", "todossub_id", "user_id", "todos","status","deadline","tag"]);
            meetingifytempDB.createTable("notes", ["meetingid", "notesub_id", "user_id", "note", "user_email", "is_public","tag"]);
            meetingifytempDB.commit();
        }
    }
    $translateProvider
        .useSanitizeValueStrategy('escapeParameters')
        .useStaticFilesLoader({
            prefix: 'translations/locale-',
            suffix: '.json'
        });

    $translateProvider.preferredLanguage(session[0]?session[0]["locale"]:'en');
}])

meetingifyApp.config(function($routeProvider,$httpProvider){
    $routeProvider
        .when('/',{
            controller: 'LogInController',
            controllerAs: 'LogIn',
            templateUrl: 'js/meetingify/views/login.html'
        })
        .when('/main',{
            controller: 'MainMenuController',
            controllerAs: 'MainMenuCtrl',
            templateUrl: 'js/meetingify/views/mainmenu.html'
        })
        .when('/meetings',{
            controller: 'MeetingsController',
            controllerAs: 'MeetingsCtrl',
            templateUrl: 'js/meetingify/views/meetings.html'
        })
        .when('/meeting_basics',{
            controller: 'MeetingBasicsController',
            controllerAs:'MeetingBasicsCtrl',
            templateUrl: 'js/meetingify/views/meeting_basics.html'
        })
        .when('/meeting_participants',{
            controller: 'MeetingParticipantsController',
            controllerAs:'MeetingParticipantsCtrl',
            templateUrl: 'js/meetingify/views/meeting_participants.html'
        })
        .when('/meeting_agenda',{
            controller: 'MeetingAgendaController',
            controllerAs:'MeetingAgendaCtrl',
            templateUrl: 'js/meetingify/views/meeting_agenda.html'
        })
        .when('/meeting_files',{
            controller: 'MeetingFilesController',
            controllerAs:'MeetingFilesCtrl',
            templateUrl: 'js/meetingify/views/meeting_files.html'
        })
        .when('/meeting_publish',{
            controller: 'MeetingPublishController',
            controllerAs:'MeetingPublishCtrl',
            templateUrl: 'js/meetingify/views/meeting_publish.html'
        })
        .when('/settings',{
            controller: 'SettingsController',
            controllerAs: 'SettingsCtrl',
            templateUrl: 'js/meetingify/views/settings.html'
        })
        .when('/status',{
            controller: 'StatusController',
            controllerAs: 'StatusCtrl',
            templateUrl: 'js/meetingify/views/status.html'
        })
        .when('/sync',{
            controller: 'SyncController',
            controllerAs: 'SyncCtrl',
            templateUrl: 'js/meetingify/views/sync.html'
        })
        .when('/single/:id',{
            controller: 'SingleController',
            controllerAs: 'SingleCtrl',
            templateUrl: 'js/meetingify/views/single.html'
        })
        .when('/single_basics',{
            controller: 'SingleBasicsController',
            controllerAs: 'SingleBasicsCtrl',
            templateUrl: 'js/meetingify/views/single_basics.html'
        })
        .when('/single_agenda',{
            controller: 'SingleAgendaController',
            controllerAs:'SingleAgendaCtrl',
            templateUrl: 'js/meetingify/views/single_agenda.html'
        })
        .when('/single_participants',{
            controller: 'SingleParticipantsController',
            controllerAs:'SingleParticipantsCtrl',
            templateUrl: 'js/meetingify/views/single_participants.html'
        })
        .when('/send_email',{
            controller: 'SendEmailController',
            controllerAs:'SendEmailCtrl',
            templateUrl: 'js/meetingify/views/send_email.html'
        })
        .when('/single_files',{
            controller: 'SingleFilesController',
            controllerAs:'SingleFilesCtrl',
            templateUrl: 'js/meetingify/views/single_files.html'
        })
        .when('/single_note',{
            controller: 'SingleNoteController',
            controllerAs:'SingleNoteCtrl',
            templateUrl: 'js/meetingify/views/single_note.html'
        })
        .when('/single_todo',{
            controller: 'SingleTodoController',
            controllerAs:'SingleTodoCtrl',
            templateUrl: 'js/meetingify/views/single_todo.html'
        })
        .when('/single_publish',{
            controller: 'SinglePublishController',
            controllerAs:'SinglePublishCtrl',
            templateUrl: 'js/meetingify/views/single_publish.html'
        })
        .when('/open_todos',{
            controller: 'OpenTodosController',
            controllerAs:'OpenTodosCtrl',
            templateUrl: 'js/meetingify/views/open_todos.html'
        })
        .otherwise({
            redirectTo: '/'
        });

    //hook to grab uploaded bytes, can be used in any http call
    XMLHttpRequest.prototype.setRequestHeader = (function(sup) {
        return function(header, value) {
            if ((header === "__XHR__") && angular.isFunction(value))
                value(this);
            else
                sup.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.setRequestHeader);

    //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = '*';
    $httpProvider.interceptors.push('AuthorizationInterceptor');
});

meetingifyApp.run(['$rootScope','$location',function($rootScope,$location){
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if(!meetingifyDB.tableExists("session")){
            meetingifyDB.drop();
            $location.path ("/");
        }
        session = meetingifyDB.queryAll("session",{query:{ID:1}});
        if(session[0] == null) $location.path ("/");
        else if(session[0]["logged_in"] == 0)  $location.path ("/");
    });

    if(session[0] != null && session[0]["logged_in"] == 1&& ($location.path() === '/'||$location.path() === '')) {
        $location.path("/main");
    }

    window.addEventListener('load', function(e) {
        window.applicationCache.addEventListener('updateready', function(e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                // Browser downloaded a new app cache.
                //if (confirm('A new version of this site is available. Load it?')) {window.location.reload();}

                appCache.swapCache(); // The fetch was successful, swap in the new cache.
                window.location.reload();
            } else {
                // Manifest didn't changed. Nothing new to server.
            }
        }, false);

    }, false);

}]);