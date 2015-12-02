var blessed = require('blessed')
var contrib = require('blessed-contrib')

module.exports = function () {
  var screen = blessed.screen()
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  var grid = new contrib.grid({rows: 12, cols: 12, screen: screen})
  var map = grid.set(0, 0, 12, 9, contrib.map, {label: 'World Map'})
  map.addMarker({"lon" : "139.6833", "lat": "35.6833", color: "red", char: "X" })
  var box = grid.set(0, 9, 12, 3, blessed.box, {content: 'Search'})

  screen.render();
};
