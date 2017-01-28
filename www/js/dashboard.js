var targetRange = 1.6; // TODO work out how far we can see
var camera = 1;
var loop = 1;
var currentGyro = 0
var offsetGyro = 0
$(document).ready(function() {
    var listener = new window.keypress.Listener();

    listener.simple_combo("1", switchCamera);
    $("#camChange").click(switchCamera);

    listener.simple_combo("2", resetVideo);
    $("#resetVideo").click(resetVideo);

    listener.simple_combo("3", resetGyro);
    $("#resetGyro").click(resetGyro);

    listener.simple_combo("4", reverseControl);
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
    $("#camChange").toggleClass("click");
    setTimeout(function(){$("#camChange").toggleClass("click");}, 50);

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
        $("#resetVideo").toggleClass("click");
        setTimeout(function(){$("#resetVideo").toggleClass("click");}, 50);

        if (camera === 1){
        $("#camera").removeAttr("src").attr("src", "http://10.47.74.2:5800/?action=stream");
        $("#camera").attr("src", "http://10.47.74.2:5800/?action=stream");

    }
    else if (camera === 2) {
        $("#camera").removeAttr("src").attr("src", "img/camera.jpg");
        $("#camera").attr("src", "img/camera.jpg");


}}


function resetGyro(){
    $("#resetGyro").toggleClass("click");
    setTimeout(function(){$("#resetGyro").toggleClass("click");}, 50);

    offsetGyro = currentGyro;
    rotateCompass(offsetGyro)
}

function reverseControl() {
    $("#reverseControl").toggleClass("click");

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
            currentGyro = value;
            break;
        case "/SmartDashboard/climb":
            
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
   // heading = Math.PI - heading; // gyro is the wrong way around
    heading = heading - offsetGyro;
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
