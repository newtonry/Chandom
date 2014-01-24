var fs = require("fs");
var mime = require('mime');

var serveFile = function(response, path) {	
	fs.readFile(path, function(error, data) {
		if (error) {
			response.writeHead(404, {"Content-Type": "text/html"});
			response.end("<h1>404: The requested content is missing!</h1>");
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