/*globals self,importScripts,createPaletteFromCanvas */

importScripts('quantize.js', 'color-thief.js');

self.onmessage = function (event) {

    'use strict';

    var wpArray = event.data;

    for (var i = 0; i < wpArray.length; i++) {
        var wp = wpArray[i];
        var foundColor = createPaletteFromCanvas(wp.data, wp.pixelCount, wp.colors);
        wpArray[i].result = foundColor;
    }

    self.postMessage(wpArray);

    self.close();
};
