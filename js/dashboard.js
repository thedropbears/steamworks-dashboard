var currentGyro = 0
var offsetGyro = 0
var cameraStream1 = "http://rpi3-4774.local:1181/stream.mjpg"
var alliance = "red"
var other_alliance = "blue"
var timerStart = false;
var firstReset = false;
var timerFrom = 135;
var timerCounter = true;
var intervalTimer;

$(document).ready(function () {
    $("#state").attr("src", "img/icons/stationaryred.png");
    $("#compass").attr("src", "img/robotred.png");
    $("#robotSVG").attr("xlink:href", "img/robotred.png");

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    attachRobotConnectionIndicator("#connection", 35)

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/Autonomous Mode");

    loadCameraOnConnect(
    {container: '#camera1',
    port: 1181,
    image_url: '/stream.mjpg',
    host: "rpi3-4774.local",
    data_url: '/settings.json',
    attrs: {
        width: 640,
        height: 480
    }
});

    $("#checklist").submit(remove_form)
});

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/robot/mode":
            if (value === "teleop") {
                if (!timerStart) {
                    startTimer();
                    remove_form();
                    break;
                }
            }
            if (value === "disabled") {
                resetTimer();
                break;
            }

            break;

        case "/SmartDashboard/imu_heading":
            rotateCompass(value + Math.PI);
            currentGyro = value;
            break;

        case "/FMSInfo/GameSpecificMessage":
            set_map_locations(value)

        case "/FMSInfo/IsRedAlliance":
            if (value === true) {
                alliance = "red"
                other_alliance = "blue"
                document.documentElement.style.setProperty('--accent-colour', '#C62828')
            } else if (value === false) {
                alliance = "blue"
                other_alliance = "red"
                document.documentElement.style.setProperty('--accent-colour', '#3565bf')
            }
            $("#compass").attr("src", "img/robot" + alliance + ".png");
            $("#robotSVG").attr("src", "img/robot" + alliance + ".png");
            $("#robotSVG").attr("xlink:href", "img/robot" + alliance + ".png");

            break;

    }
}


function set_map_locations(locations) {
    enemy_switch = locations[0] + "1"
    scale = locations[1] + "2"
    our_switch = locations[2] + "3"

    $("#"+enemy_switch).addClass(alliance).removeClass(other_alliance)
    $("#"+scale).addClass(alliance).removeClass(other_alliance)
    $("#"+our_switch).addClass(alliance).removeClass(other_alliance)

    $("#"+side_switch(enemy_switch)).addClass(other_alliance).removeClass(alliance)
    $("#"+side_switch(scale)).addClass(other_alliance).removeClass(alliance)
    $("#"+side_switch(our_switch)).addClass(other_alliance).removeClass(alliance)
}

function side_switch(a){
    if (a[0] === "L"){
        return "R"+a[1]
    }
    else if (a[0] === "R"){
        return "L"+a[1]
    }
}

function remove_form() {
    $(".checklist-div").hide()
    $(".inital-hide").show()
}

function rotateCompass(heading) {
    heading = heading - offsetGyro;
    heading = Math.PI - heading; // gyro is the wrong way around
    var robot = document.getElementById("compass");
    robot.style.transform = "rotate(" + heading + "rad)";

}

function startTimer() {
    if (intervalTimer == null) {
        intervalTimer = setInterval(timer, 1000)
    }
}

function resetTimer() {2
    clearInterval(intervalTimer);
    timerFrom = 135;
    intervalTimer = null;
    document.getElementById("cycleTimer").innerHTML = "135";
}

function timer() {
    if (timerCounter) {
        timerFrom = timerFrom - 1
        if (timerFrom <= 0) {
            document.getElementById("cycleTimer").innerHTML = "";
            $("#cycleTimer").text("GOOD JOB!");
            $("#cycleTimer").css("font-size", "425%")
            $("#cycleTimer").css("color", "#4CAF50")
            $("#cycleTimer").toggleClass("blink");
        } else if (timerFrom < 10) {
            document.getElementById("cycleTimer").innerHTML = "00" + timerFrom;
        } else if (timerFrom < 100) {
            document.getElementById("cycleTimer").innerHTML = "0" + timerFrom;
        } else {
            document.getElementById("cycleTimer").innerHTML = timerFrom;
        }
    }
}
