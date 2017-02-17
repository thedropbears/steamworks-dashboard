var targetRange = 3; // TODO work out how far we can see
var camera = 1;
var loop = 1;
var currentGyro = 0
var offsetGyro = 0
var cameraStream1 = "http://10.47.74.2:8083/stream.mjpg"
var reverse = false;
var alliance = "red"
var currentState = "stationary"
var timerStart = false;

$(document).ready(function () {
    var listener = new window.keypress.Listener();

    $("#camera").attr("src", cameraStream1);
    $("#state").attr("src", "img/icons/stationaryred.png");
    $("#compass").attr("src", "img/robotred.png");
    $("#robotSVG").attr("xlink:href", "img/robotred.png");

    listener.simple_combo("1", switchCamera);
    $("#camChange").click(switchCamera);

    listener.simple_combo("2", resetVideo);
    $("#resetVideo").click(resetVideo);

    listener.simple_combo("3", resetGyro);
    $("#resetGyro").click(resetGyro);

    listener.simple_combo("4", reverseControl);
    $("#reverseControl").click(reverseControl);

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
    setTimeout(function () {
        $("#camChange").toggleClass("click");
    }, 50);

    camera = camera + 1;
    if (camera > 2) {
        camera = 1;
    }
    if (camera === 1) {
        $("#camera").attr("src", cameraStream1);
        $("#cameraName").text("Front Camera");

    } else if (camera === 2) {
        $("#camera").attr("src", "img/camera.jpg");
        $("#cameraName").text("Back Camera");
    }

}

function resetVideo() {
    $("#resetVideo").toggleClass("click");
    setTimeout(function () {
        $("#resetVideo").toggleClass("click");
    }, 50);

    if (camera === 1) {
        $("#camera").removeAttr("src").attr("src", cameraStream1);

    } else if (camera === 2) {
        $("#camera").removeAttr("src").attr("src", "img/camera.jpg");


    }
}


function resetGyro() {
    $("#resetGyro").toggleClass("click");
    setTimeout(function () {
        $("#resetGyro").toggleClass("click");
    }, 50);

    offsetGyro = currentGyro;
    rotateCompass(currentGyro + Math.PI)
}

function reverseControl() {
    $("#reverseControl").toggleClass("click");
    reverse = !reverse;
    NetworkTables.putValue("/SmartDashboard/reverse", reverse);
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
            if (value == "teleop"){
            if (!timerStart) {
                timerCycle();
            }}
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

        case "/SmartDashboard/vision_x":
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

        case "changeRobotStrafePos/visionY":
            changeRobotRange(value)
            break;
    }
}

function changeRobotRange(dist) {
    var ypos = (dist - targetRange) / targetRange;
    if (ypos >= 1.0) {
        ypos = 1.0;
    }
    ypos += 1; // value from -1 to 1
    console.log(ypos)
    ypos = ypos * 50;
    ypos = (ypos / 100) * 15
    ypos = ypos + "em";
    console.log(ypos)
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
    var countDownDate = Math.floor(Date.now() / 1000) + 21;
    var loop = 0;
    var climb = false;
    var x = setInterval(function () {
        var now = Math.floor(Date.now() / 1000);
        var distance = countDownDate - now;

        if (distance < 10) {
            document.getElementById("cycleTimer").innerHTML = "0" + distance;
        } else {
            document.getElementById("cycleTimer").innerHTML = distance;
        }

        if (distance <= 0) {
            loop = loop + 1;
            if (loop <= 4) {
                document.getElementById("cycleTimer").innerHTML = "21";
                $("#timerInfo").text(loop + 1);
                countDownDate = Math.floor(Date.now() / 1000) + 21;
            } else if (climb === false) {
                document.getElementById("cycleTimer").innerHTML = "30";
                countDownDate = Math.floor(Date.now() / 1000) + 30;
                $("#timerInfo").text("CLIMB");
                $("#timerInfo").toggleClass("blink");
                climb = true;
            } else if (climb) {
                clearInterval(x);
                document.getElementById("cycleTimer").innerHTML = "00";
                $("#timerInfo").toggleClass("blink");
                $("#timerInfo").text("");

            }
        }


    }, 1000);
}
