var socketio = require('socket.io');
var User = require('./lib/user.js');
var takenNames = [];
var users = {};
var rooms = {};
	
var createChat = function(server) {
	var io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
		// socket.emit('update', {text: "You have joined!"});
		// socket.emit('successMsg', {text: "Please choose a name:"});
		
		setupNameListener(socket);
		setupRoomChangeListener(socket);
		setupMessageListener(socket, io);

		// socket.on('room', )
		
	  // io.sockets.emit('update', {text: "A new person has joined!"});
		
		// socket.on('message', function (data) {
		// 	    io.sockets.emit('update', data);
		// 	console.log(takenNames);
		// 	console.log(data);
		// 	  });
	});
};

var setupMessageListener = function(socket, io) {
	socket.on('message', function(data) {
		var user = users[socket.id] = (users[socket.id] || new User(socket.id));
		if (!user.name) {
			socket.emit('warningMsg', {text: "You must have a name if you want a voice! Please set it with /name yourname"});
		} else if (!user.room) {
			socket.emit('warningMsg', {text: "It's lonely in here. Please join a room with /room roomname"});
		} else {
			
			messageToRoom(escapeHTML(data.text), user.room, io);
			// io.sockets.emit('normalMsg', {text: data.text});
		}
	});
};

var setupNameListener = function(socket) {
	socket.on('name', function (data) {
		var name = escapeHTML(data.name)
		if (indexOf(name, takenNames) != -1) {
			socket.emit('warningMsg', {text: name + " is already taken! Please choose another name."});
		} else {
			users[socket.id] = (users[socket.id] || new User(socket.id));
			removeFromTakenNames(users[socket.id].name);

			users[socket.id].name = name;				
			takenNames.push(name);
			
			socket.emit('setName', {name: name});
			socket.emit('successMsg', {text: "You're name is now " + name});
		}
	});
};

var setupRoomChangeListener = function(socket) {
	socket.on('room', function(data) {
		var room = escapeHTML(data.room);
		//creates new room if it doesn't exist
		rooms[room] = (rooms[room] || []);
		rooms[room].push(socket.id);

		//needs to remove person from old room too
		users[socket.id].room = room;
		
		socket.emit('successMsg', {text: "You're now in " + room});
	});
};

var messageToRoom = function(message, room, io) {
	for(var i=0; i < rooms[room]; i++) {

		//get this working
		io.sockets.socket[rooms[room][i]].emit('normalMsg', message);
	}
};

var removeFromTakenNames = function(name) {
	var ind = indexOf(name, takenNames);
	if (ind != -1) {
		takenNames.splice(ind);
	}
};

//since IE < 9 doesn't like array's indexOf
var indexOf = function(value, arr) {
	for(var ind=0; ind < arr.length; ind++) {
		if (arr[ind] === value) {
			return ind;
		}
	}
	return -1;
};

function escapeHTML(input) {
    return String(input).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


exports.createChat = createChat;