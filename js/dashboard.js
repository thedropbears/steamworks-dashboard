var currentGyro = 0
var offsetGyro = 0
var cameraStream1 = "http://rpi3-4774.local:1181/"
var alliance = "red"
var timerStart = false;
var firstReset = false;

$(document).ready(function () {
    $("#camera1").attr("src", cameraStream1);
    $("#state").attr("src", "img/icons/stationaryred.png");
    $("#compass").attr("src", "img/robotred.png");
    $("#robotSVG").attr("xlink:href", "img/robotred.png");


    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called  when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);


    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/Autonomous Mode");

    $("#checklist").submit(remove_form)
});

function resetVideo() {

    if (camera === 1) {
        $("#camera").removeAttr("src").attr("src", cameraStream1);

    }
}

function resetGyro() {

    offsetGyro = currentGyro;
    rotateCompass(currentGyro + Math.PI)
}


function onNetworkTablesConnection(connected) {
    // TODO
    if (connected) {

    } else {

    }
}

function onRobotConnection(connected) {
    if (connected) {
        $("#Connection").text("Connected");
        $("#Connection").css({
            "color": "lime"
        });
    } else {
        $("#Connection").text("Disconnected");
        $("#Connection").css({
            "color": "red"
        });

    }
}
function remove_form() {
    $(".checklist-div").hide()
    $(".inital-hide").show()
}

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/robot/mode":
            if (value === "teleop") {
                if (!timerStart) {
                    timerCycle();
                }
            }
            if (value != "disabled"){
                remove_form()
            }

            break;

        case "/SmartDashboard/gyro":
            rotateCompass(value + Math.PI);
            currentGyro = value;
            break;


        case "/SmartDashboard/alliance":
            if (value === "red") {
                alliance = "red"
                document.documentElement.style.setProperty('--accent-colour', '#C62828')
            } else if (value === "blue") {
                alliance = "blue"
                document.documentElement.style.setProperty('--accent-colour', '#3565bf')
            }
            $("#compass").attr("src", "img/robot" + alliance + ".png");
            $("#robotSVG").attr("src", "img/robot" + alliance + ".png");
            $("#robotSVG").attr("xlink:href", "img/robot" + alliance + ".png");

            break;

        case "/SmartDashboard/reset_video":
            resetVideo()
            break;

    }
}


function rotateCompass(heading) {
    heading = heading - offsetGyro;
    heading = Math.PI - heading; // gyro is the wrong way around
    var robot = document.getElementById("compass");
    robot.style.transform = "rotate(" + heading + "rad)";

}

function timerCycle() {
    var countDownDate = Math.floor(Date.now() / 1000) + 135;
    var x = setInterval(function () {
        var now = Math.floor(Date.now() / 1000);
        var difference = countDownDate - now;

        if (difference <= 0) {
            document.getElementById("cycleTimer").innerHTML = "";
            $("#timerInfo").text("GOOD JOB!");
            $("#timerInfo").toggleClass("blink");
        }
        else if (difference < 10) {
            document.getElementById("cycleTimer").innerHTML = "00" + difference;
        } else if (difference < 100) {
            document.getElementById("cycleTimer").innerHTML = "0" + difference;
        }
        else {
            document.getElementById("cycleTimer").innerHTML = difference;
        }
    }, 1000);
}
