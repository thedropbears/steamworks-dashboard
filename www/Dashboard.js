$(document).ready(function() {
    if ($('#timer') === '0:30') {
        break
    }
    $("#reverseControl").click(function() {
    $("#reverseControl").toggleClass("activeReverse");}
    // sets a function that will be called when the websocket connects/disconnects
    NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

    // sets a function that will be called when the robot connects/disconnects
    NetworkTables.addRobotConnectionListener(onRobotConnection, true);

    // sets a function that will be called when any NetworkTables key/value changes
    NetworkTables.addGlobalListener(onValueChanged, true);
});



function onValueChanged(key, value, isNew) {
    switch (key) {
      case key
}
