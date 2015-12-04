var blessed = require('blessed')
var contrib = require('blessed-contrib')
var _ = require('lodash')
var Promise = require('promise');

var countries = require('./countries')();

var colors = ["red", "blue", "yellow", "cyan", "magenta", "white"];
var randomColor = function() {
  return colors[_.random(0, 5)];
};

var worldMap = {
  screen: null,
  grid: null,
  map: null,
  gauge: null,
  form: null,
  searchBtn: null,
  user: null,
  setup: function() {
    this.screen = blessed.screen()
    this.screen.key(['escape', 'q', 'C-c'], function(ch, key) {
      return process.exit(0);
    });
    //setup screen
    this.grid = new contrib.grid({rows: 12, cols: 12, screen: this.screen});
    this.map = this.grid.set(0, 0, 11, 9, contrib.map, {label: 'World Map'});
    this.gauge = this.grid.set(0, 9, 2, 3, contrib.gauge, {label: 'Progress', stroke: 'magenta', fill: 'magenta'});
    this.form = this.grid.set(2, 9, 9, 3, blessed.form, {keys: true});
    this.status = this.grid.set(11, 0, 1, 12, blessed.form, {keys: true});
    that = this;
    this.form.on('submit', function(data) {
      that.search(data);
    });
  },

  login: function() {
    return new Promise(function (resolve, reject) {
      var user = Kii.getCurrentUser();
      if (user == null) {
        KiiUser.authenticate("worldmap", "worldmap", {
          success: function(theUser) {
            worldMap.user = theUser;
            resolve(theUser);
          },
          failure: function(theUser, errorString) {
            user = KiiUser.userWithUsername("worldmap", "worldmap");
            user.register({
              success: function(theUser) {
                worldMap.user = user;
                resolve(user);
              },
              failure: function(theUser, errorString) {
                reject();
              }
            });
          }
        })
      } else {
        worldMap.user = user;
        resolve(user)
      };
    });
  },

  render: function() {
    this.screen.render();
  },

  countriesBucket: function() {
    return this.user.bucketWithName("countries");
  },

  showSearchForm: function() {
    if (worldMap.form.init) {
      return;
    }
    worldMap.form.init = true;
    var currentPosition = 0;
    blessed.text({
      parent: worldMap.form,
      content: "Filter countries by marker color and bounding area:",
      top: currentPosition++
    });
    currentPosition++;
    currentPosition++;
    var addCheckBox = function(name, text) {
      blessed.checkbox({
        name: name,
        parent: worldMap.form,
        mouse: true,
        keys: true,
        checked: true,
        text: text,
        top: currentPosition++
      });
    };
    addCheckBox("red", "Red");
    addCheckBox("blue", "Blue");
    addCheckBox("yellow", "Yellow");
    addCheckBox("cyan", "Cyan");
    addCheckBox("magenta", "Magenta");
    addCheckBox("white", "White");
    currentPosition++;
    var addInput = function(name, label, value) {
      blessed.text({
        parent: worldMap.form,
        content: label,
        top: currentPosition
      });
      var textBox = blessed.textbox({
        parent: worldMap.form,
        name: name,
        input: true,
        keys: true,
        top: currentPosition++,
        height: 1,
        width: 28,
        left: 10,
        value: value,
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: 'white',
            bg: 'white'
          },
          focus: {
            bg: 'red',
            fg: 'white'
          }
        }
      });
    };

    blessed.text({
      parent: worldMap.form,
      content: "NE:",
      top: currentPosition++
    });
    addInput("lat", "Latitude")
    addInput("lon", "Longitute")
    currentPosition++;
    blessed.text({
      parent: worldMap.form,
      content: "SW:",
      top: currentPosition++
    });
    addInput("lat", "Latitude")
    addInput("lon", "Longitute")

    currentPosition++;
    this.searchBtn = blessed.button({
      parent: worldMap.form,
      mouse: true,
      keys: true,
      padding: {
        left: 2,
        right: 2
      },
      top: currentPosition++,
      shrink: true,
      name: 'Search',
      content: 'Search',
      style: {
        bg: 'blue',
        focus: {
          bg: 'red'
        },
        hover: {
          bg: 'red'
        }
      }
    });
    this.searchBtn.on('press', function() {
      worldMap.form.submit()
    });
    this.render();
  },
  search: function(data) {
    /*
    Data will be similar to this:
    {
      red: true
      blue: false
      ...
      lat: ['1', '2'],
      long: ['1', '2']
    }
    */
    worldMap.map.clearMarkers();
    worldMap.gauge.setPercent(0);
    var countriesBucket = worldMap.countriesBucket();
    colorClauses = [];
    for(var i=0; i<colors.length; i++) {
      if (data[colors[i]] == true) {
        colorClauses.push(KiiClause.equals("color", colors[i]));
      }
    }

    var inRange = function(min, max, num) {
      return (num > min) && (num < max) && (!isNaN(num));
    };

    // geobox
    var ne, sw, geobox;
    if (data['lon'].length == 2 && data['lat'].length == 2) {
      var lat1 = parseFloat(data['lat'][0]);
      var lon1 = parseFloat(data['lon'][0]);
      var lat2 = parseFloat(data['lat'][1]);
      var lon2 = parseFloat(data['lon'][1]);

      // lat: must be -90 to 90
      // lon: must be -180 to 180      
      if (!inRange(-90, 90, lat1) || !inRange(-180, 180, lon1) || !inRange(-90, 90, lat2) || !inRange(-180, 180, lon2)) {
        worldMap.log("Latitude must be [-90, 90] and logitude must be [-180, 180].")
        return;
      }
      var ne = KiiGeoPoint.geoPoint(lat1, lon1);
      var sw = KiiGeoPoint.geoPoint(lat2, lon2);
      geobox = KiiClause.geoBox('location', ne, sw);
      worldMap.draw_latlon_box(lat1, lon1, lat2, lon2);
    }

    var query;
    if (colorClauses.length > 1) {
      if (geobox == null) {
        query = KiiQuery.queryWithClause(
          KiiClause.createWithWhere("or", colorClauses)
        );        
      } else {
        query = KiiQuery.queryWithClause(
          KiiClause.and(KiiClause.createWithWhere("or", colorClauses), geobox)
        );        
      }
    } else if (colorClauses.length == 1) {
      if (geobox == null) {
        query = KiiQuery.queryWithClause(colorClauses[0]);
      } else {
        query = KiiQuery.queryWithClause(
          KiiClause.and(colorClauses[0], geobox)
        );
      }
    } else {
      // all query
      if (geobox == null) {
        query = KiiQuery.queryWithClause();
      } else {
        query = KiiQuery.queryWithClause(geobox);
      }
    }
    worldMap.gauge.setPercent(25);
    worldMap.render();
    countriesBucket.executeQuery(
      query, {
      success: function(queryPerformed, resultSet, nextQuery) {
        filteredCountries = []
        worldMap.gauge.setPercent(50);
        worldMap.render();
        for(var i=0; i<resultSet.length; i++) {
          filteredCountries.push({
            id: resultSet[i].getUUID(),
            color: resultSet[i].get('color')
          });
        }
        worldMap.redraw(filteredCountries);
      },
      failure: function(queryPerformed, error) {
        worldMap.log(error);
      }
    });
  },
  redraw: function(filteredCountries) {
    worldMap.gauge.setPercent(75);
    worldMap.render();
    for(var i=0; i<filteredCountries.length; i++) {
      country = filteredCountries[i];
      worldMap.map.addMarker(_.extend(countries[country['id']], {color: country['color'], char: "x"}));
    }
    worldMap.gauge.setPercent(100);
    worldMap.log("Found " + filteredCountries.length + " countries matching search criteria.");
    worldMap.render();
  },
  log: function(message) {
    worldMap.status.setContent(message);
  },
  draw_latlon_box: function(lat1, lon1, lat2, lon2) {
    //ne
    worldMap.map.addMarker({lat: lat1, lon: lon1, color: 'white', char: 'ne'});
    //sw
    worldMap.map.addMarker({lat: lat2, lon: lon2, color: 'white', char: 'sw'});
  }
}


module.exports = function () {
  worldMap.setup();
  // store countries
  var user = worldMap.login().then(function(user) {
    var countriesBucket = worldMap.countriesBucket();
    // Create an object to ensure that the bucket is created when creating all the countries
    var emptyObject = countriesBucket.createObjectWithID('empty');
    // Since we are using 'createObjectWithID', the saveAllFields function should be used (not 'save').
    emptyObject.saveAllFields({
      success: function(savedObj) {
        var point, object;
        var length = _.keys(countries).length;
        index = 0;
        _.each(countries, function(country, key) {
          // create a KiiGeoPoint for the countries location
          point = KiiGeoPoint.geoPoint(
            parseFloat(country["lat"]),
            parseFloat(country["lon"])
          );
          // create the object, set it's locate and assign it a random colour.
          object = countriesBucket.createObjectWithID(key);
          object.setGeoPoint("location", point);
          object.set("color", randomColor());
          // Again, saveAllFields required if specifying the ID
          object.saveAllFields({
            success: function(savedObj) {
              worldMap.map.addMarker(_.extend(country, {color: savedObj.get("color"), char: "x"}));
              percent = Math.ceil(++index/length * 100)
              worldMap.gauge.setPercent(percent);
              worldMap.render();
              if (percent == 100) {
                emptyObject.delete();
                worldMap.showSearchForm();
                worldMap.log("Saved data for " + length + " countries.");
                worldMap.render();
              }
            },
            failure: function(savedObj, error) {
              // Show the error in the status bar
              worldMap.log(error);
            }
          });
          worldMap.render();
        });
      },
      failure: function(savedObj, error) {
        // Show the error in the status bar
        worldMap.log(error);
      }
    });
  });
  worldMap.render();
};
