var http = require("http");
var router = require("./router.js").router;
var createChat = require('./chat_server.js').createChat;

var server = http.createServer(function(request, response){
	router(request, response);
});

server.listen(8000);
createChat(server);

console.log("Server Started");