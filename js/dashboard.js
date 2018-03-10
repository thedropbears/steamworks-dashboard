var timerFrom = 135;
var counting = 0;
var timerCounter = true;
var intervalTimer;
var sports_music = document.createElement('audio');
sports_music.setAttribute('src', 'music/Sports.ogg');

$(document).on("keypress", function (e) {
    if (e.key === "]") {
        hideChecklist();
    }
});

$(function () {
    sports_music.play();

    NetworkTables.addKeyListener("/robot/mode", robotModeCallback, true);
    NetworkTables.addKeyListener("/components/intake_automation/state/current_state", intakeStateCallback, true);
    NetworkTables.addKeyListener("/components/intake/is_cube_contained", (k, v) => cubeContained(v), true);
    
    NetworkTables.addKeyListener("/components/intake/arms_out", (k, v) => armsOut(v), true);
    NetworkTables.addKeyListener("/components/intake/clamp_pos", (k, v) => clampPos(v), true);
    NetworkTables.addKeyListener("/components/intake/kicker_pos", (k, v) => kickerPos(v), true);

    NetworkTables.addKeyListener("/SmartDashboard/imu_heading", (k, v) => rotateCompass(v), true);
    NetworkTables.addKeyListener("/FMSInfo/GameSpecificMessage", (k, v) => setMapLocations(v), true);
    NetworkTables.addKeyListener("/FMSInfo/IsRedAlliance", allianceCallback, true);

    attachRobotConnectionIndicator("#connection", 35);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "Autonomous Mode");

    $("#checklist input").click(function () {
        if ($("#checklist input").length === $("#checklist input:checked").length) {
            hideChecklist();
        }
    });
    NetworkTables.addKeyListener("/SmartDashboard/Autonomous Mode/selected", () => $("#check-auto").prop("checked", true));

    NetworkTables.addRobotConnectionListener(function (connected) {
        if (!connected) {
            $("#check-connection").prop("checked", false);
        }
    }, true);
    NetworkTables.addKeyListener(
        "/robot/is_ds_attached",
        (key, value) => $("#check-connection").prop("checked", value),
        true);

    loadCameraOnConnect({
        container: '#camera',
        port: 1181,
        image_url: '/stream.mjpg',
        host: "10.47.74.77",
        data_url: '/settings.json',
        attrs: {
            width: 583,
            height: 438
        }
    });

    $(".checklist-hidden").hide();
});

function robotModeCallback(key, value) {
    if (value === "teleop") {
        startTimer();
        hideChecklist();
    } else if (value === "disabled") {
        resetTimer();
    }
}

function intakeStateCallback(key, value) {
    if (value === "eject_cube") {
        resetTimer();
        startTimer();
    }
}

function allianceCallback(key, isRed) {
    var alliance;
    if (isRed) {
        $(":root").addClass("red-alliance").removeClass("blue-alliance");
        alliance = "red";
    } else {
        $(":root").removeClass("red-alliance").addClass("blue-alliance");
        alliance = "blue";
    }
    $("#compass").attr("src", "img/robot" + alliance + ".png");
}

function cubeContained(status) {
    if (status) {
        $("#cube-light").addClass("light-on");
    } else {
        $("#cube-light").removeClass("light-on");
    }
}

function armsOut(status) {
    if (status) {
        $("#arm-light").addClass("light-on");
    } else {
        $("#arm-light").removeClass("light-on");
    }
}
function clampPos(status) {
    if (status) {
        $("#intake-light").addClass("light-on");
    } else {
        $("#intake-light").removeClass("light-on");
    }
}
function kickerPos(status) {
    if (status) {
        $("#kicker-light").addClass("light-on");
    } else {
        $("#kicker-light").removeClass("light-on");
    }
}


function setMapLocations(locations) {
    $("#field-our-switch").attr("alignment", locations[0]);
    $("#field-scale").attr("alignment", locations[1]);
    $("#field-enemy-switch").attr("alignment", locations[2]);
}

function hideChecklist() {
    $("#checklist").hide();
    $(".checklist-hidden").show();
}

function rotateCompass(heading) {
    heading = -heading; // our coordinate system is the wrong way around
    $("#compass").css("transform", "rotate(" + heading + "rad)");
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
