var fs = require("fs");
var mime = require('mime');

//hangs up if file isn't there
var serveFile = function(response, path) {	
	console.log('somebody is requesting' + path);
	fs.readFile(path, function(error, data) {
		if (error) {
			response.writeHead(400);
		} else {
			response.writeHead(200, {"Content-Type": mime.lookup(path)});
			response.end(data);			
		}
	});
}

var router = function(request, response) {
	var path = './public'
	console.log(request.url)
	if (request.url === "/") {
		path += '/index.html';
	} else {
		path += request.url;
	}
	
	serveFile(response, path);
}

exports.router = router;