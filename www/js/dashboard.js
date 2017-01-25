var targetRange = 1.6; // TODO work out how far we can see
var camera = 1;
$(document).ready(function() {
    $("#reverseControl").click(function() {
        $("#reverseControl").toggleClass("activeReverse");
    });
    $("#camChange").click(function() {
      camera = camera+ 1;
      if (camera > 2){
        camera = 1;}
      if (camera === 1){
          $("#camera").css({"content":"url(img/car.jpg)"});
          $("#camChange").text("Switch to camera 2");

      }
      else if (camera === 2) {
        $("#camera").css({"content":"url(img/camera.jpg)"});
        $("#camChange").text("Switch to camera 1");
      }
    });



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
        $("#Connection").css("color:lime;");
    } else {
        $("#Connection").text("Disconnected :(");
        $("#Connection").css("color:red;");

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
/*
function onNetworkTablesConnection(key, value){
    switch(key){
      case radian;
      $("#compass")..style.transform = (value *  57.3);

    }
}*/
