var blessed = require('blessed')
var contrib = require('blessed-contrib')
var _ = require('lodash')
var Promise = require('promise');

var countries = {
  ad: {"lat": "42.546245", "lon" : "1.601554"},
  ae: {"lat": "23.424076", "lon" : "53.847818"},
  af: {"lat": "33.93911", "lon" : "67.709953"},
  au: {"lat": "-25.274398", "lon" : "133.775136"},
  al: {"lat": "41.153332", "lon" : "20.168331"},
  ao: {"lat": "-11.202692", "lon" : "17.873887"},
  aq: {"lat": "-75.250973", "lon" : "-0.071389"},
  ar: {"lat": "-38.416097", "lon" : "-63.616672"},
  be: {"lat": "50.503887", "lon" : "4.469936"},
  br: {"lat": "-14.235004", "lon" : "-51.92528"},
  ca: {"lat": "56.130366", "lon" : "-106.346771"},
  cl: {"lat": "-35.675147", "lon" : "-71.542969"},
  cn: {"lat": "35.86166", "lon" : "104.195397"},
  co: {"lat": "4.570868", "lon" : "-74.297333"},
  cu: {"lat": "21.521757", "lon" : "-77.781167"},
  de: {"lat": "51.165691", "lon" : "10.451526"},
  dk: {"lat": "56.26392", "lon" : "9.501785"},
  ec: {"lat": "-1.831239", "lon" : "-78.183406"},
  eg: {"lat": "26.820553", "lon" : "30.802498"},
  fi: {"lat": "61.92411", "lon" : "25.748151"},
  gb: {"lat": "55.378051", "lon" : "-3.435973"},
  ge: {"lat": "42.315407", "lon" : "42.315407"},
  gi: {"lat": "36.137741", "lon" : "-5.345374"},
  gr: {"lat": "39.074208", "lon" : "39.074208"},
  gt: {"lat": "15.783471", "lon" : "-15.783471"},
  hk: {"lat": "22.396428", "lon" : "114.109497"},
  hu: {"lat": "47.162494", "lon" : "19.503304"},
  id: {"lat": "-0.789275", "lon" : "113.921327"},
  ie: {"lat": "53.41291", "lon" : "-8.24389"},
  in: {"lat": "20.593684", "lon" : "20.593684"},
  it: {"lat": "41.87194", "lon" : "12.56738"},
  jm: {"lat": "30.585164", "lon" : "36.238414"},
  jp: {"lat": "36.204824", "lon" : "138.252924"},
  ke: {"lat": "-0.023559", "lon" : "37.906193"},
  kh: {"lat": "12.565679", "lon" : "104.990963"},
  kr: {"lat": "35.907757", "lon" : "127.766922"},
  kz: {"lat": "48.019573", "lon" : "66.923684"},
  la: {"lat": "19.85627", "lon" : "102.495496"},
  lk: {"lat": "7.873054", "lon" : "80.771797"},
  ma: {"lat": "31.791702", "lon" : "-7.09262"},
  mc: {"lat": "43.750298", "lon" : "7.412841"},
  me: {"lat": "42.708678", "lon" : "19.37439"},
  mg: {"lat": "-18.766947", "lon" : "46.869107"},
  mk: {"lat": "41.608635", "lon" : "21.745275"},
  mm: {"lat": "21.913965", "lon" : "95.956223"},
  mn: {"lat": "46.862496", "lon" : "103.846656"},
  mo: {"lat": "22.198745", "lon" : "113.543873"},
  mt: {"lat": "35.937496", "lon" : "14.375416"},
  mu: {"lat": "-20.348404", "lon" : "57.552152"},
  mv: {"lat": "3.202778", "lon" : "73.22068"},
  mx: {"lat": "23.634501", "lon" : "-102.552784"},
  my: {"lat": "4.210484", "lon" : "101.975766"},
  mz: {"lat": "-18.665695", "lon" : "35.529562"},
  ng: {"lat": "9.081999", "lon" : "8.675277"},
  nl: {"lat": "52.132633", "lon" : "5.291266"},
  nz: {"lat": "-40.900557", "lon" : "174.885971"},
  pe: {"lat": "-9.189967", "lon" : "-75.015152"},
  pt: {"lat": "39.399872", "lon" : "-8.224454"},
  ro: {"lat": "45.943161", "lon" : "24.96676"},
  ru: {"lat": "61.52401", "lon" : "105.318756"},
  rw: {"lat": "-1.940278", "lon" : "29.873888"},
  sa: {"lat": "23.885942", "lon" : "45.079162"},
  se: {"lat": "60.128161", "lon" : "18.643501"},
  sg: {"lat": "1.352083", "lon" : "103.819836"},
  tn: {"lat": "33.886917", "lon" : "9.537499"},
  tk: {"lat": "38.963745", "lon" : "35.243322"},
  us: {"lat": "37.09024", "lon" : "-95.712891"},
  uz: {"lat": "41.37749", "lon" : "64.585262"},
  ve: {"lat": "6.42375", "lon" : "-66.58973"},
  vn: {"lat": "14.058324", "lon" : "108.277199"},
  ws: {"lat": "-13.759029", "lon" : "-172.104629"},
  ye: {"lat": "15.552727", "lon" : "48.516388"},
  za: {"lat": "-30.559482", "lon" : "22.937506"},
  zm: {"lat": "-13.133897", "lon" : "27.849332"},
};

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
    this.map = this.grid.set(0, 0, 12, 9, contrib.map, {label: 'World Map'});
    this.gauge = this.grid.set(0, 9, 2, 3, contrib.gauge, {label: 'Progress', stroke: 'magenta', fill: 'magenta'});
    this.form = this.grid.set(2, 9, 10, 3, blessed.form, {keys: true});
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

  showSearchForm: function() {
    var currentPosition = 0;
    blessed.text({
      parent: worldMap.form,
      content: "Filter countries by marker color and bounding area:",
      top: currentPosition++
    });
    currentPosition++;
    currentPosition++;
    var addCheckBox = function(text) {
      blessed.checkbox({
        parent: worldMap.form,
        mouse: true,
        keys: true,
        checked: true,
        text: text,
        top: currentPosition++
      });
    };
    addCheckBox("Red");
    addCheckBox("Blue");
    addCheckBox("Yellow");
    addCheckBox("Cyan");
    addCheckBox("Magenta");
    addCheckBox("White");
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
    addInput("lat", "Latitude", "50")
    addInput("lon", "Longitute", "160")
    currentPosition++;
    blessed.text({
      parent: worldMap.form,
      content: "SW:",
      top: currentPosition++
    });
    addInput("lat", "Latitude", "30")
    addInput("lon", "Longitute", "130")
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
      checkbox: [true, true, true, true, true, true]
      lat: ['1', '2'],
      long: ['1', '2']
    }
    */
    worldMap.map.clearMarkers();
    worldMap.gauge.setPercent(0);
    var countriesBucket = worldMap.user.bucketWithName("countries");
    colorClauses = [];
    for(var i=0; i<colors.length; i++) {
      if (data['checkbox'][i] == true) {
        colorClauses.push(KiiClause.equals("color", colors[i]));
      }
    }

    // geobox
    var ne, sw, geobox;
    if (data['lon'].length == 2 && data['lat'].length == 2) {
      /*if (!inRange(-90, 90, _latitude) || !inRange(-180, 180, _longitude)) {
        throw root.InvalidArgumentException("Specified latitide or longitude is invalid");
      }*/
      // lat: must be -90 to 90
      // lon: must be -180 to 180
      ne = KiiGeoPoint.geoPoint(parseFloat(data['lat'][0]), parseFloat(data['lon'][0]));
      sw = KiiGeoPoint.geoPoint(parseFloat(data['lat'][1]), parseFloat(data['lon'][1]));
      geobox = KiiClause.geoBox('location', ne, sw);
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
        console.log(error);
      }
    });
  },
  redraw: function(filteredCountries) {
    worldMap.gauge.setPercent(75);
    worldMap.render();
    for(var i=0; i<filteredCountries.length; i++) {
      country = filteredCountries[i];
      worldMap.map.addMarker(_.extend(countries[country['id']], {color: country['color'], char: "X"}));
    }
    worldMap.gauge.setPercent(100);
    worldMap.render();
  }
}


module.exports = function () {
  worldMap.setup();
  // store countries
  var user = worldMap.login().then(function(user) {
    var countriesBucket = user.bucketWithName("countries");
    var emptyObject = countriesBucket.createObjectWithID('empty');
    emptyObject.saveAllFields({
      success: function(savedObj) {
        var point, object;
        var length = _.keys(countries).length;
        index = 0;
        _.each(countries, function(country, key) {
          point = KiiGeoPoint.geoPoint(
            parseFloat(country["lat"]),
            parseFloat(country["lon"])
          );
          object = countriesBucket.createObjectWithID(key);
          object.setGeoPoint("location", point);
          object.set("color", randomColor());
          // saveAllFields required if specifying the ID
          object.saveAllFields({
            success: function(savedObj) {
              worldMap.map.addMarker(_.extend(country, {color: savedObj.get("color"), char: "X"}));
              percent = Math.ceil(++index/length * 100)
              worldMap.gauge.setPercent(percent);
              worldMap.render();
              if (percent == 100) {
                emptyObject.delete();
                worldMap.showSearchForm();
              }
            },
            failure: function(savedObj, error) {
              console.log(error);
            }
          });
          worldMap.render();
        });
      },
      failure: function(savedObj, error) {
        console.log(error);
      }
    });
  });
  worldMap.render();
};
