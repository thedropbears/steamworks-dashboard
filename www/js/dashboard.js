var targetRange = 1.6; // TODO work out how far we can see

$(document).ready(function() {
    $("#reverseControl").click(function() {
        $("#reverseControl").toggleClass("activeReverse");
    });
    timerTimer()
    timerCycle()

    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/autonomous_mode");
});

function onRobotConnection(connected) {
    // TODO
    if (connected) {

    } else {

    }
}

function onNetworkTablesConnection(connected) {
    if (connected) {
        $("#Connection").text("Connected!");
    } else {
        $("#Connection").text("Disconnected :(");
    }
}

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/SmartDashboard/range_finder":
            changeRobotRange(value);
            break;

        case "/SmartDashboard/gyro":
            rotateCompass(value);
            rotateRobot(value);
            break;
    }
}

function changeRobotRange(dist) {
    var robot = document.getElementById("position-display-robot");
    var xpos = (dist-targetRange) / targetRange;
    if (xpos >= 1.0) {
        xpos = 1.0;
    }
    xpos = xpos*10.0 + 10.0 - 1.0;
    robot.style.top = xpos + "vw";
}

function changeRobotStrafePos(visionX) {
    visionX = -visionX;
    if (visionX >= -1.0 && visionX <= 1.0) {
        var robot = document.getElementById("position-display-robot");
        var ypos = visionX*10.0 - 0.75 + 10.0;
        robot.style.left = ypos + "vw";
    }
}

function rotateRobot(heading) {
    heading = -heading; // gyro is the wrong way around (ccw, not clockwise)
    var robot = document.getElementById("position-display-robot");
    robot.style.transform = "rotate(" + heading + "rad)";
}

function rotateCompass(heading) {
    heading = Math.PI - heading; // gyro is the wrong way around
    var robot = document.getElementById("compass");
    robot.style.transform = "rotate(" + heading + "rad)";
}
function timerTimer(){
var countDownDate = Math.floor(new Date().getTime() / 1000) + 135;

var x = setInterval(function() {
    var now = Math.floor(new Date().getTime() / 1000);
    var distance = countDownDate - now;
    var minutes = Math.floor(distance % (60 * 60) / (60));
    var seconds = Math.floor(distance % (60));

    if (seconds < 10) {
        index.html.getElementById("timer").innerHTML = minutes + ":0" + seconds;
    }
    else {
        index.html.getElementById("timer").innerHTML = minutes + ":" + seconds;
    }
    if (distance < 0) {
        clearInterval(x);
        index.html.getElementById("timer").innerHTML = "Finished";
    }
}, 1000);
}

function timerCycle(){
var countDownDate = Math.floor(new Date().getTime() / 1000) + 21;

var x = setInterval(function() {
    var now = Math.floor(new Date().getTime() / 1000);
    var distance = countDownDate - now;
    var seconds = Math.floor(distance % (60));

    if (seconds < 10) {
        index.html.getElementById("cycleTimer").innerHTML = "0" + seconds;
    }
    else {
        index.html.getElementById("cycleTimer").innerHTML = seconds;
    }
    if (distance < 0) {
        clearInterval(x);
        index.html.getElementById("cycleTimer").innerHTML = "Finished";
    }
}, 1000);}
