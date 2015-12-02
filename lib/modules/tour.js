var blessed = require('blessed')
var contrib = require('blessed-contrib')

module.exports = function () {
  var screen = blessed.screen()
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  var map = contrib.map({label: 'Kii Cloud - Server Locations'})
  screen.append(map)

  map.addMarker({"lon" : "139.6833", "lat": "35.6833", color: "red", char: "X" })

  screen.render();
};
