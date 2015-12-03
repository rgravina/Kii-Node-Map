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

var colors = ["red", "blue", "yellow", "cyan", "magenta", "white"]
var randomColor = function() {
  return colors[_.random(0, 5)];
};

var setup = function() {
  var screen = blessed.screen()
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });
  return screen;
};

var login = function() {
  return new Promise(function (resolve, reject) {
    var user = Kii.getCurrentUser();
    if (user == null) {
      KiiUser.authenticate("worldmap", "worldmap", {
        success: function(theUser) {
          resolve(theUser);
        },
        failure: function(theUser, errorString) {
          user = KiiUser.userWithUsername("worldmap", "worldmap");
          user.register({
            success: function(theUser) {
              resolve(user);
            },
            failure: function(theUser, errorString) {
              reject();
            }
          });
        }
      })
    } else {
      resolve(user)
    };
  });
}

module.exports = function () {
  var screen = setup();
  
  //setup screen
  var grid = new contrib.grid({rows: 12, cols: 12, screen: screen});
  var map = grid.set(0, 0, 12, 9, contrib.map, {label: 'World Map'});
  var gauge = grid.set(0, 9, 2, 3, contrib.gauge, {label: 'Progress', stroke: 'magenta', fill: 'magenta'});
  var box = grid.set(2, 9, 10, 3, blessed.box);

  // store countries
  var user = login().then(function(user) {
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
          // saveAllFields required if specifying the ID
          object.saveAllFields({
            success: function(savedObj) {
              map.addMarker(_.extend(country, {color: randomColor(), char: "X"}));
              percent = Math.ceil(++index/length * 100)
              gauge.setPercent(percent);
              screen.render();
              if (percent == 100) {
                emptyObject.delete();
              }
            },
            failure: function(savedObj, error) {
              console.log(error);
            }
          });
          screen.render();
        });
      },
      failure: function(savedObj, error) {
        console.log(error);
      }
    });
  });

  screen.render();
};
