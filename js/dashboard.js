var currentGyro = 0;
var offsetGyro = 0;
var alliance = "red";
var other_alliance = "blue";
var timerStart = false;
var timerFrom = 135;
var counting = 0;
var timerCounter = true;
var intervalTimer;
var sports_music = document.createElement('audio');
sports_music.setAttribute('src', 'music/Sports.ogg');

$(document).on("keypress", function (e) {
    if (e.key === "]") {
        removeForm(true);
    }
});

$(document).ready(function () {
    sports_music.play();

    $("#compass").attr("src", "img/robotred.png");

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    attachRobotConnectionIndicator("#connection", 35);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/Autonomous Mode");

    $("input").click(function () {
        if ($("input").length === $("input:checked").length) {
            removeForm();
        }
    });

    NetworkTables.addRobotConnectionListener(function (connected) {
        if (connected) {
            $("#check-connection").prop("checked", true);
        }
    }, true);

    autoChecker();

    loadCameraOnConnect({
        container: '#camera',
        port: 1181,
        image_url: '/stream.mjpg',
        host: "rpi3-4774.local",
        data_url: '/settings.json',
        attrs: {
            width: 583,
            height: 438
        }
    });

});

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/robot/mode":
            if (value === "teleop") {
                startTimer();
                removeForm(true);
                break;
            } else if (value === "disabled") {
                resetTimer();
                break;
            }
            break;

        case "/components/intake_automation/current_state":
            if (value === "eject_cube") {
                resetTimer();
                startTimer();
            
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
            setMapLocations(value);
            break;

        case "/FMSInfo/IsRedAlliance":
            if (value === true) {
                alliance = "red";
                other_alliance = "blue";
                document.documentElement.style.setProperty('--accent-colour', '#C62828');
            } else if (value === false) {
                alliance = "blue";
                other_alliance = "red";
                document.documentElement.style.setProperty('--accent-colour', '#3565bf');
            }
            $("#compass").removeAttr("src");
            $("#compass").attr("src", "img/robot" + alliance + ".png");
            break;
    }
}

function cubeContained(status) {
    if (status) {
        $("#cube_light").addClass("light_on").removeClass("light_off");
    } else {
        $("#cube_light").addClass("light_off").removeClass("light_on");
    }
}

function autoChecker() {
    $("#auto-select").val("None");
    $("#auto-select").change(function () {
        if ($(this).val() != "None") {
            $("#auto").prop("checked", true);
        } else {
            $("#auto").prop("checked", false);
        }
    });
}


function setMapLocations(locations) {
    enemy_switch = locations[0] + "1";
    scale = locations[1] + "2";
    our_switch = locations[2] + "3";

    $("#" + enemy_switch).addClass(alliance).removeClass(other_alliance);
    $("#" + scale).addClass(alliance).removeClass(other_alliance);
    $("#" + our_switch).addClass(alliance).removeClass(other_alliance);

    $("#" + sideSwitch(enemy_switch)).addClass(other_alliance).removeClass(alliance);
    $("#" + sideSwitch(scale)).addClass(other_alliance).removeClass(alliance);
    $("#" + sideSwitch(our_switch)).addClass(other_alliance).removeClass(alliance);
}

function sideSwitch(a) {
    if (a[0] === "L") {
        return "R" + a[1];
    } else if (a[0] === "R") {
        return "L" + a[1];
    }
}

function removeForm(force) {
    if ($("input").length === $("input:checked").length) {
        $(".checklist-div").hide();
        $(".inital-hide").show();
    } else if (force) {
        $(".checklist-div").hide();
        $(".inital-hide").show();
    }
}

function rotateCompass(heading) {
    heading = heading - offsetGyro;
    heading = Math.PI - heading; // gyro is the wrong way around
    document.getElementById("compass").style.transform = "rotate(" + heading + "rad)";
}

function startTimer() {
    if (intervalTimer == null) {
        intervalTimer = setInterval(timer, 1000);
    }
}

function resetTimer() {
    clearInterval(intervalTimer);
    counting = 0;
    intervalTimer = null;
    $("#cycleTimer").text("000");
}

function timer() {
    if (timerCounter) {
        counting = counting + 1;
        if (counting < 10) {
            $("#cycleTimer").text("00" + counting);
        } else if (counting < 100) {
            $("#cycleTimer").text("0" + counting);
        } else if (counting < timerFrom) {
            $("#cycleTimer").text(counting);
        } else {
            $("#cycleTimer").text(timerFrom);
        }
    }
}