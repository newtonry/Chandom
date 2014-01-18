var socketio = require('socket.io')	
	
var createChat = function(server) {
	var io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
	  socket.on('message', function (data) {
	    io.sockets.emit('update', data);
			
			console.log(data);
	  });
	})
};

exports.createChat = createChat;