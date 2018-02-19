var currentGyro = 0
var offsetGyro = 0
var alliance = "red"
var other_alliance = "blue"
var timerStart = false;
var timerFrom = 135;
var timerCounter = true;
var intervalTimer;
var developing = false

var sports_music = document.createElement('audio');
sports_music.setAttribute('src', 'music/Sports.ogg');

$(document).ready(function () {
    sports_music.play()

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    attachRobotConnectionIndicator("#connection", 35)

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/Autonomous Mode");

    if (developing) {
	   removeForm();
    }

    NetworkTables.addRobotConnectionListener(function(connected){
        $("#check-connection").prop("checked", true);
    }, true);

    autoChecker()

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

});

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/robot/mode":
            if (value === "teleop" && !timerStart) {
                startTimer();
                removeForm();
                break;
            } else if (value === "disabled") {
                resetTimer();
                break;
            }
            break;
        
        case "/components/intake/is_cube_contained":
            cubeContained(value);
            break;

        case "/SmartDashboard/imu_heading":
            rotateCompass(value + Math.PI);
            currentGyro = value;
            break;

        case "/FMSInfo/GameSpecificMessage":
            setMapLocations(value)
            break;

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
function cubeContained(status){
    if (status){
        $("#cube_light").addClass("light-green").removeClass("green")
    }
    else{
        $("#cube_light").addClass("green").removeClass("light-green")
    }
}

function autoChecker() {
    $("#auto-select").val("None");
    $( "#auto-select" ).change(function() {
        if ($(this).val() != "None") {
            $("#auto").prop("checked", true);
        }
    });
    $("input").click(removeForm);
}


function setMapLocations(locations) {
    enemy_switch = locations[0] + "1"
    scale = locations[1] + "2"
    our_switch = locations[2] + "3"

    $("#"+enemy_switch).addClass(alliance).removeClass(other_alliance)
    $("#"+scale).addClass(alliance).removeClass(other_alliance)
    $("#"+our_switch).addClass(alliance).removeClass(other_alliance)

    $("#"+sideSwitch(enemy_switch)).addClass(other_alliance).removeClass(alliance)
    $("#"+sideSwitch(scale)).addClass(other_alliance).removeClass(alliance)
    $("#"+sideSwitch(our_switch)).addClass(other_alliance).removeClass(alliance)
}

function sideSwitch(a){
    if (a[0] === "L"){
        return "R"+a[1]
    }
    else if (a[0] === "R"){
        return "L"+a[1]
    }
}

function removeForm() {
    if ($("input").length === $("input:checked").length){
        $(".checklist-div").hide()
        $(".inital-hide").show()
    }
}

function rotateCompass(heading) {
    heading = heading - offsetGyro;
    heading = Math.PI - heading; // gyro is the wrong way around
    document.getElementById("compass").style.transform = "rotate(" + heading + "rad)";
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
    $("#cycleTimer").text(135);
}

function timer() {
    if (timerCounter) {
        timerFrom = timerFrom - 1
        if (timerFrom <= 0) {
            $("#cycleTimer").text("GOOD JOB!");
            $("#cycleTimer").css("color", "#4CAF50")
            $("#cycleTimer").toggleClass("blink");
        } else if (timerFrom < 10) {
            $("#cycleTimer").text("00" + timerFrom);
        } else if (timerFrom < 100) {
            $("#cycleTimer").text("0" + timerFrom);
        } else {
            $("#cycleTimer").text(timerFrom);
        }
    }
}
