var socketio = require('socket.io')	
	
var createChat = function(server) {
	var io = socketio.listen(server);
	var usernames = [];
	
	io.sockets.on('connection', function(socket){
		
	  io.sockets.emit('update', {text: "A new person has joined!"});
		usernames.push("user" + usernames.length);
		
		socket.on('message', function (data) {
	    io.sockets.emit('update', data);
			console.log(usernames);
			console.log(data);
	  });
	})
};

exports.createChat = createChat;