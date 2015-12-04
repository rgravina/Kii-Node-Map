# Kii node.js map example

An example Kii Cloud app making use of geoqueries.

![Screenshot](https://raw.githubusercontent.com/wiki/rgravina/Kii-Node-Map/images/screenshot.png)

## Tutorial

Please see the tutorial [wiki page](https://github.com/rgravina/Kii-Node-Map/wiki/Kii-Node-Map-Tutorial) for a more detailed installation guide and walkthrough.

If you'd just like to install and run the example, please see below.

## Installation

### From the developer portal
If downloaded from the developer portal, the app id, key and site for the 'Kii Tutorial' app will be entered in the file `lib/modules/init.js`. 

### From the Github repository
To run directly from this repository, please replace these values in `lib/modules/init.js`:

From:
```javascript
Kii.initializeWithSite(
  "__KII_APP_ID__",
  "__KII_APP_KEY__",
  __KII_APP_SITE__
);
```
To:
```javascript
Kii.initializeWithSite(
  "<app id>",
  "<app key>",
  KiiSite.US
);
```

## Running

To run, install dependencies and start the main script.
```
npm install
node bin/kii-node-map.js
```
