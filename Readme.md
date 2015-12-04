# Kii-Node-Map - a node.js map example

An example Kii Cloud app making use of geoqueries.

![Screenshot](https://raw.githubusercontent.com/wiki/rgravina/Kii-Node-Map/images/screenshot.png)

## Tutorial

Please see the tutorial [wiki page](https://github.com/rgravina/Kii-Node-Map/wiki/Kii-Node-Map-Tutorial) for a more detailed installation guide and walkthrough.

If you'd just like to install and run the example, please see below.

## Installation

### From the developer portal
If downloaded from the developer portal, the app id, key and site for the 'Kii Tutorial' app will be entered in the file `lib/modules/init.js`. 

### From the Github repository
To run directly from this repository, please replace these values in `lib/modules/init.js` with your app id, app key and site:

```javascript
Kii.initializeWithSite(
  "__KII_APP_ID__", // e.g. "abcd1234"
  "__KII_APP_KEY__", // e.g. "asdf4321"
  __KII_APP_SITE__ // e.g. KiiSite.US
  );
```

## Running

To run, install dependencies and start with:
```
npm install
node bin/kii-node-map.js
```
