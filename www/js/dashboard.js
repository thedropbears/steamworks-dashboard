var targetRange = 4; // TODO work out how far we can see
var camera = 1;
var loop = 1;
var currentGyro = 0
var offsetGyro = 0
var cameraStream1 = "http://rpi3-4774.local:1181/"
var cameraStream2 = "http://10.47.74.11:5802/?action=stream"
var reverse = false;
var alliance = "red"
var currentState = "stationary"
var timerStart = false;
var firstReset = false;

$(document).ready(function () {

    $("#camera1").attr("src", cameraStream1);
    $('#camera2').attr("src", cameraStream2)
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
});
//buttons
/*
function switchCamera(value) {
    if (value === "front") {
        $("#camera2").css("display", "none");

        $("#camera1").css("display", "inline");
        camera = 1

    } else if (value === "back") {
        $("#camera1").css("display", "none");

        $("#camera2").css("display", "inline")
        camera = 2
    }

}
*/
function resetVideo() {

    if (camera === 1) {
        $("#camera").removeAttr("src").attr("src", cameraStream1);

    } else if (camera === 2) {
        $("#camera").removeAttr("src").attr("src", cameraStream2);


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

function onValueChanged(key, value, isNew) {
    switch (key) {
        case "/robot/mode":
            if (value === "teleop"){
            if (!timerStart) {
                timerCycle();
            }}
            /*if (value != "disabled"){
                if (!started){
                resetGyro();
                started = true;
            }}*/

            break;

        case "/SmartDashboard/gyro":
            rotateCompass(value + Math.PI);
            currentGyro = value;
            break;

        case "/SmartDashboard/rail_pos":
            var railPos = value + 1;
            // XXX wtf does this do
            railPos = railPos * 50;
            railPos = railPos * 0.9;
            document.getElementById("railRect").setAttribute("x", railPos + "%");
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
            $("#state").attr("src", "img/icons/" + currentState + alliance + ".png")
            $("#robotSVG").attr("xlink:href", "img/robot" + alliance + ".png");

            break;

        case "/SmartDashboard/state":
            currentState = value;
            $("#state").attr("src", "img/icons/" + value + alliance + ".png");
            break;

        case "/components/vision/x":
            changeRobotStrafePos(value);

            var railVisionpos = value + 1;
            // XXX wtf does this do
            railVisionpos = railVisionpos * 50;
            railVisionpos = railVisionpos * 0.9;
            document.getElementById("railVision").setAttribute("x", railVisionpos + "%");
            if (-0.1 <= value && value <= 0.1){
                document.getElementById("railVision").setAttribute("fill", "green");
            }
            else{
                document.getElementById("railVision").setAttribute("fill", "yellow");                
            }
           break;

        case "/SmartDashboard/range":
            if (currentState === "unloadingGear") {
            changeRobotRange(value)
            }
            break;
        
        case "/SmartDashboard/camera":
            switchCamera(value)
            break;

        case "/SmartDashboard/reset_video":
            resetVideo()
            break;
        
    }
}

function changeRobotRange(dist) {
    var ypos = (dist - targetRange) / targetRange;
    if (ypos >= 1.0) {
        ypos = 1.0;
    }
    ypos += 1; // value from -1 to 1
    ypos = ypos * 50;
    ypos = (ypos / 100) * 15
    ypos = ypos + "em";
    document.getElementById("robotSVG").setAttribute("y", ypos);

}

function changeRobotStrafePos(visionX) {
    visionX = -visionX;
    if (visionX >= -1.0 && visionX <= 1.0) {
        var robot = document.getElementById("robotSVG");

        var xpos = visionX + 1; // -1 -to 1 now 0 to 2
        xpos = xpos * 50; // percentage 
        xpos = xpos * 0.65; // width of picture  
        document.getElementById("robotSVG").setAttribute("x", xpos + "%");

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
