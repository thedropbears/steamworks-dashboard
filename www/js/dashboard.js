var targetRange = 1.6; // TODO work out how far we can see
var camera = 1;
var loop = 1;
$(document).ready(function() {
    var listener = new window.keypress.Listener();

    listener.simple_combo("space", switchCamera);
    $("#camChange").click(switchCamera);

    listener.simple_combo(",", resetVideo);
    $("#resetVideo").click(resetVideo);

    listener.simple_combo(".", resetGyro);
    $("#resetGyro").click(resetGyro);

    listener.simple_combo("/", reverseControl);
    $("#reverseControl").click(reverseControl);

    timerCycle();

    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called  when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);


    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);

    // hook up our SendableChoosers to combo boxes
    attachSelectToSendableChooser("#auto-select", "/SmartDashboard/autonomous_mode");
});
//buttons
function switchCamera() {
    console.log("words");
    camera = camera + 1;
    if (camera > 2) {
        camera = 1;
    }
    if (camera === 1) {
        $("#camera").attr("src", "http://10.47.74.2:5800/?action=stream");
        $("#cameraName").text("Front Camera");

    } else if (camera === 2) {
        $("#camera").attr("src", "img/camera.jpg");
        $("#cameraName").text("Back Camera");
    }
}

function resetVideo(){
    $("#camera").attr("src", "#");
        if (camera === 1){
        $("#camera").attr("src", "http://10.47.74.2:5800/?action=stream");
        console.log("1");

    }
    else if (camera === 2) {
        $("#camera").attr("src", "img/camera.jpg");
                    console.log("2");


}}


function resetGyro(){

}

function reverseControl() {
    $("#reverseControl").toggleClass("activeReverse");

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

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/SmartDashboard/range_finder":
            changeRobotRange(value);
            break;

        case "/SmartDashboard/gyro":
            rotateCompass(value);
            //rotateRobot(value);
            break;
    }
}

function changeRobotRange(dist) {
    var robot = document.getElementById("position-display-robot");
    var xpos = (dist - targetRange) / targetRange;
    if (xpos >= 1.0) {
        xpos = 1.0;
    }
    xpos = xpos * 10.0 + 10.0 - 1.0;
    robot.style.top = xpos + "vw";
}

function changeRobotStrafePos(visionX) {
    visionX = -visionX;
    if (visionX >= -1.0 && visionX <= 1.0) {
        var robot = document.getElementById("position-display-robot");
        var ypos = visionX * 10.0 - 0.75 + 10.0;
        robot.style.left = ypos + "vw";
    }
}
/*
function rotateRobot(heading) {
    heading = -heading; // gyro is the wrong way around (ccw, not clockwise)
    var robot = document.getElementById("position-display-robot");
    robot.style.transform = "rotate(" + heading + "rad)";
}*/

function rotateCompass(heading) {
    heading = Math.PI - heading; // gyro is the wrong way around
    var robot = document.getElementById("compass");
    robot.style.transform = "rotate(" + heading + "rad)";
}

function timerCycle() {
    var countDownDate = Math.floor(Date.now() / 1000) + 21;
    var loop = 0;
    var climb = false;
    var x = setInterval(function() {
        var now = Math.floor(Date.now() / 1000);
        var distance = countDownDate - now;

        if (distance < 10) {
            document.getElementById("cycleTimer").innerHTML = "0" + distance;
        } else {
            document.getElementById("cycleTimer").innerHTML = distance;
        }

        if (distance <= 0) {
            loop = loop + 1;
            if (loop <= 4){
              document.getElementById("cycleTimer").innerHTML = "21";
              $("#timerInfo").text(loop+1);
                countDownDate = Math.floor(Date.now() / 1000) + 21;
            }
            else if (climb === false){
              document.getElementById("cycleTimer").innerHTML = "30";
                countDownDate = Math.floor(Date.now() / 1000) + 30;
                $("#timerInfo").text("CLIMB");
                $("#timerInfo").css({
                    "color": "red"
                });
                $("#timerInfo").toggleClass("blink");
              climb = true;
            }

            else if (climb) {
              clearInterval(x);
                  document.getElementById("cycleTimer").innerHTML = "00";
                  $("#timerInfo").toggleClass("blink");
                  $("#timerInfo").css({
                      "color": "#3565bf"
                  });
                  $("#timerInfo").text("");

                }}


    }, 1000);
}
