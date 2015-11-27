/**
 * Created by Relvin Gonzalez on 9/9/2015
 * Common utility functions
 */

/**
 *
 * @param memberId
 * @param localDb
 * @returns fullname of the member
 */

//gets full name from id
function getFullnameFromId(memberId, localDb){
    var fullname = " ";
    if(memberId == localStorage["current_user"]){
        fullname = session[0]["first_name"] + " " + session[0]["last_name"];
    }
    else {

        localDb.queryAll("members", {
            query: function (row) {
                if (row.userid == memberId||row.ID == memberId) {
                    fullname = row.fullname;
                }
            }
        });
    }

    return fullname;

}
function getOwnerName(id){
    if(id==0)
        return "All";
    var name = getFullnameFromId(id,meetingifyDB);
    var email = getEmailFromId(id,meetingifyDB);
    return name==" "?email:name ;
}
function extensionCheck(filename){
    var extension = getFileExtension(filename);
    if(extension != ".gif"&&extension != ".jpg"&&extension != ".png"&&extension != ".doc" &&
        extension != ".docx"&&extension != ".ppt"&&extension != ".pptx"&&extension != ".xls"&&
        extension != ".xlsx"&&extension != ".zip"&&extension != ".tgz"&&extension != ".ics"&&
        extension != ".jpeg"&&extension != ".pdf"&&extension != ".mp3"&&extension != ".wav")
        return false;
    else
        return true;
}
function getFileExtension(string){
    var pattern=/\.[0-9a-z]+$/i;
    var extension = (string).match(pattern);
    return extension;
}

//gets email from id
function getEmailFromId(memberId, localDb){
    var email;
    if(memberId == localStorage["current_user"]){
        email = session[0]["user_email"];
    }
    else {
        localDb.queryAll("members", {
            query: function (row) {
                if (row.userid == memberId) {
                    email = row.user_email;
                }
            }
        });
    }
    return email;

}

//Returns random int
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//formats date
function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}

