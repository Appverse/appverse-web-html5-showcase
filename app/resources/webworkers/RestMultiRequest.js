importScripts('ajax.js');

self.addEventListener('message', function (e) {
    var data = e.data;

    switch (data.method) {
        case 'GET':
            getRequest(data.resource, function(xhr) {
                self.postMessage({status: xhr.status, responseText: xhr.responseText});
            });
            break;
        case 'POST':
            postRequest(data.resource, function(xhr) {
                self.postMessage({status: xhr.status, responseText: xhr.responseText});
            });
            break;
        case 'DELETE':
            postRequest(data.resource, function(xhr) {
                self.postMessage({status: xhr.status, responseText: xhr.responseText});
            });
            break;
        case 'DELETE':
            postRequest(data.resource, function(xhr) {
                self.postMessage({status: xhr.status, responseText: xhr.responseText});
            });
            break;
        default:
            getRequest(data.resource, function(xhr) {
                self.postMessage({status: xhr.status, responseText: xhr.responseText});
            });
    }
}, false);
