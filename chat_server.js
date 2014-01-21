var socketio = require('socket.io');
var User = require('./lib/user.js');
var takenNames = [];
var users = {};
	
var createChat = function(server) {
	var io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
		setupNameListener(socket);
		setupRoomChangeListener(socket);
		setupMessageListener(socket, io);
		setupRoomListListener(socket, io);
		
		//should write an on disconnect too
		
	});
};

var setupMessageListener = function(socket, io) {
	socket.on('message', function(data) {
		var user = users[socket.id] = (users[socket.id] || new User(socket.id));

		if (!user.name) {
			socket.emit('warningMsg', {text: "You must have a name if you want a voice! Please set it with /name yourname"});
		} else if (!user.room) {
			socket.emit('warningMsg', {text: "It's lonely in here. Please join a room with /join roomname"});
		} else {
			io.sockets.in(user.room).emit('normalMsg', {text: users[socket.id].name + ": " + escapeHTML(data.text)});
		}
	});
};

var setupNameListener = function(socket) {
	socket.on('name', function (data) {
		var name = escapeHTML(data.name);
		
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
		
		//leave old room
		if(users[socket.id].room) {
			socket.leave(users[socket.id].room);
		}

		users[socket.id].room = room;
		socket.join(room);		
		socket.emit('successMsg', {text: "You're now in " + room});
		socket.broadcast.to(room).emit('successMsg', {text: users[socket.id].name + " has joined the room"});
	});
};

var setupRoomListListener = function(socket, io) {
	socket.on('listRooms', function() {
		socket.emit('normalMsg', {text: "The rooms are: "});
		for(var room in io.sockets.manager.rooms) {
			if (room != "") {
				io.sockets.emit('normalMsg', {text: "*" + room.slice(1,room.length)});
			}
		}
	});
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