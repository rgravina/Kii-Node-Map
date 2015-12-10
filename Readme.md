# Kii-Node-Map - a node.js map example

An example Kii Cloud app making use of geoqueries.

![Screenshot](https://raw.githubusercontent.com/wiki/rgravina/Kii-Node-Map/images/screenshot.png)

## Tutorial

Please see the tutorial [wiki page](https://github.com/rgravina/Kii-Node-Map/wiki/Kii-Node-Map-Tutorial) for a more detailed installation guide and walkthrough.

If you'd just like to install and run the example, please see below.

## Installation

First, create (or have ready) an app on Kii Cloud. You can create one via the [developer portal](http://developer.kii.com). 
Then, replace these values in `lib/modules/init.js` with your app id, app key and site:

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
