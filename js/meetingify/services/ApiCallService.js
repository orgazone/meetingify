/**
 * Created by Relvin Gonzalez on 8/19/2015
 * Common services for calling the API
 */
meetingifyApp.factory('ApiCallService', function($q,$http,$window,GlobalVariablesService) {
    /**
     * Calls the api
     * @param appaction application action
     * @param appname application name
     * @param appsortstr application sort string
     * @param appsortint application sort int
     * @param token
     * @param appdata
     */
    function apiCall(appaction, appname, appsortstr, appsortint, appdata){
        var apiUrl = apiURL + "?appaction="+appaction;
        if(appname != "")apiUrl=apiUrl+"&appname="+appname;
        apiUrl=apiUrl+"&appid=API";
        if(appsortstr != "" )apiUrl=apiUrl+"&appsortstr="+appsortstr;
        if(appsortint != -1 )apiUrl=apiUrl+"&appsortint="+appsortint;
        if(appdata != "" ){
            apiUrl=apiUrl+"&appdata="+JSON.stringify(appdata);
        }
        return $http({
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    }

    function apiCallPublish(appaction, appname,appid, appsortstr, appsortint, appdata){
        var apiUrl = apiURL + "?appaction="+appaction;
        if(appname != "")apiUrl=apiUrl+"&appname="+appname;
        if(appid != "" )apiUrl=apiUrl+"&appid="+appid;
        if(appsortstr != "" )apiUrl=apiUrl+"&appsortstr="+appsortstr;
        if(appsortint != -1 )apiUrl=apiUrl+"&appsortint="+appsortint;
        if(appdata != "" ){
            apiUrl=apiUrl+"&appdata="+JSON.stringify(appdata);
        }
        return $http({
            url: apiUrl
        });
    }

    //calls the api with a userid
    function apiCallWithUserid(appaction, appname, appsortstr, appsortint, userid, appdata){
        var apiUrl = apiURL+"?appaction="+appaction;
        if(appname != "")apiUrl=apiUrl+"&appname="+appname;
        if(appsortstr != "" )apiUrl=apiUrl+"&appsortstr="+appsortstr;
        if(appsortint != -1 )apiUrl=apiUrl+"&appsortint="+appsortint;
        if(userid != -1 )apiUrl=apiUrl+"&userid="+userid;
        if(appdata != "" ){
            apiUrl=apiUrl+"&appdata="+JSON.stringify(appdata);
        }
        return $http({
            url: apiUrl
        });
    }

//calls the api to upload a file
    function apiCallFileUpload(file, appsortint,filedata){
        var formData = new FormData();
        var appdata= JSON.stringify(filedata);
        formData.append('file', file); //$('input[type=file]')[0].files[0]);
        formData.append("appaction", "upload");
        formData.append("appid", "API");
        formData.append("appname", "meetingify");
        formData.append("appsortstr", "FILE");
        formData.append("appsortint", appsortint); //localStorage["singleID"]);
        formData.append("appobjid", filedata.filename);
        formData.append("appdata", appdata);

        return $http.post(apiURL,formData,{
            headers: {'Content-Type': undefined,
                //code to get bytes uploaded and total bytes to upload
                __XHR__: function() {
                    return function(xhr) {
                        xhr.upload.addEventListener("progress", function(event) {
                            //No other way to do this yet without DOM manipulation here:
                            $('#loadedBytes').html(event.loaded);
                            $('#totalBytes').html(" / " + event.total);
                        });
                    };
                }},
            transformRequest: angular.identity
        });
    }

    //calls the api to Download a file
    function apiCallFileDownload(appsortint, filename,id,url){
        //replace all special characters and spaces with '-' before calling the API, this is because the api makes
        //these changes when uploading a file.
        filename = filename.toLowerCase().replace(/[^A-Za-z0-9\-\_\.]/g,"-");
        return $http({
            url: apiURL,
            method:'GET',
            params: {'appaction':"getfile",'appid':"API",'appname':"meetingify",'appdata':filename,'token':session[0]["token"],'appsortint':appsortint},
            responseType: 'arraybuffer'

        }).then(function( data ) {
            var defaultFileName=filename;
            var headers = data.headers;
            var type = headers('Content-Type');
            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
            try{
                var file = new Blob([data.data], {type: type});
            }
            catch(e) {
                var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

                if (e.name == 'TypeError'&& typeof BlobBuilder != 'undefined'  ) {
                    var bb = new BlobBuilder();
                    bb.append(data.data);
                    var file = bb.getBlob(type);
                    var element = $('#' + id);
                    element.onclick = function () {
                        saveAs(file, defaultFileName);
                    }
                    element.onclick();
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        $window.open(reader.result);
                    }
                    reader.readAsDataURL(file);
                }
                else {
                    //Browser does not support this. Open url
                    //window.location = url;
                    $window.open(url, "_self");

                }
            }
            saveAs(file, defaultFileName); //no errors, browser supports it. Save the file.

        });
    }

    //calls the api to send an invite
    function apiCallSendInvite(appname, to, destination){
        var apiUrl = apiURL+"?appaction="+"invite";
        if(appname != "")apiUrl=apiUrl+"&appname="+appname;
        var appdata = {
            to: to,
            destination: destination
        };
        var lang = "&lang=en";
        apiUrl=apiUrl+"&appdata="+JSON.stringify(appdata)+lang;

        return $http({
            url: apiUrl
        });
    }

    //Deletes a meeting from cloud and localstorage
    //meetingid  the id of the meeting to be deleted
    function apiCallDeleteMeeting(meetingid,redirect){
        return $http({
            url:apiURL+"?appaction=delete&appname=meetingify&appsortint="+meetingid+"&userid="+localStorage["current_user"]
        }).then(function( data ) {
            // if deletion successful, delete from local storage , as well
            meetingifyDB.deleteRows("members", {meetingid: meetingid});
            meetingifyDB.deleteRows("agenda", {meetingid: meetingid});
            meetingifyDB.deleteRows("files", {meetingid: meetingid});
            meetingifyDB.deleteRows("todos", {meetingid: meetingid});
            meetingifyDB.deleteRows("notes", {meetingid: meetingid});
            meetingifyDB.commit();
            meetingifyDB.deleteRows("meetings", {meetingid: meetingid});
            meetingifyDB.commit();
            localStorage['mode']='new';
            if(redirect)
                $window.location.href = "#/meetings";
        });
    }

/*    As a registered user you can send emails out of your app. The command is named "sendmail" and
    takes the receiver, subject, text and even attachments from the appdata block.
        appdata contains:
        to: rs@orga.zone
    subject: just a test
    text: this may contain simple HTML code as well
    attachment: dsc02342.jpg (that file must exist in the app specific upload directory)
    ?appaction=sendmail
    &appname=ex2
    &appid=API
    &appdata=json_encode($data)*/
    function apiCallSendEmail(to,subject,message){
        var apiUrl = apiURL+"?appaction=sendmail&appname=meetingify&appid=API";
        var appdata = {
            to:to,
            subject:subject,
            text:message
        }
        apiUrl=apiUrl+"&appdata="+JSON.stringify(appdata);
        return $http({
            url: apiUrl
        });
    }

    function apiCallLogIn(user_email,user_pass){
        GlobalVariablesService.setInterceptorSwitch(false);
        var appdata ={
            'login':user_email,
            'pw':user_pass
        }
        var apiUrl = apiURL + "?appaction=login&appname=meetingify&appid=test";
        apiUrl=apiUrl+"&appdata="+JSON.stringify(appdata);
        return $http({
            url:apiUrl
        })
    }

    function apiCallShowUser(token){
        GlobalVariablesService.setInterceptorSwitch(false);
        var apiUrl = apiURL+"?appaction=showuser&appname=meetingify&token="+token;
        return $http({
            url:apiUrl
        })
    }

    return{
        apiCall:apiCall,
        apiCallPublish:apiCallPublish,
        apiCallWithUserid:apiCallWithUserid,
        apiCallFileUpload:apiCallFileUpload,
        apiCallFileDownload:apiCallFileDownload,
        apiCallSendInvite:apiCallSendInvite,
        apiCallDeleteMeeting:apiCallDeleteMeeting,
        apiCallSendEmail:apiCallSendEmail,
        apiCallLogIn:apiCallLogIn,
        apiCallShowUser:apiCallShowUser
    }
});
