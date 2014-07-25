importScripts('quantize.js' , 'color-thief.js');

self.onmessage = function(event) {
    var wp = event.data;
    var foundColor = createPaletteFromCanvas(wp.data,wp.pixelCount, wp.colors);
    wp.result = foundColor;
    self.postMessage(wp);

    // close this worker
    self.close();
};
