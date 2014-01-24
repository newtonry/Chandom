var socketio = require('socket.io');
var User = require('./lib/user.js');
var takenNames = [];
var users = {};
	
var createChat = function(server) {
	var io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
		users[socket.id] = new User(socket.id);
	
		setupNameListener(socket);
		setupRoomChangeListener(socket, io);
		setupMessageListener(socket, io);
		setupRoomListListener(socket, io);
		setupDisconnectListener(socket, io)
	});
};

var setupMessageListener = function(socket, io) {
	socket.on('message', function(data) {
		var user = users[socket.id];

		if (!users[socket.id].name) {
			socket.emit('warningMsg', {text: "You must have a name if you want a voice! Please set it with /name yourname"});
		} else if (!users[socket.id].room) {
			socket.emit('warningMsg', {text: "It's lonely in here. Please join a room with /join roomname"});
		} else {
			io.sockets.in(users[socket.id].room).emit('normalMsg', {text: users[socket.id].name + ": " + escapeHTML(data.text)});
		}
	});
};

var setupNameListener = function(socket) {
	socket.on('name', function (data) {
		var name = escapeHTML(data.name);
		
		if (indexOf(name, takenNames) != -1) {
			socket.emit('warningMsg', {text: name + " is already taken! Please choose another name."});
		} else if (name === "" || name[0] === "/") {
			socket.emit('warningMsg', {text: "That is not a valid name!"});			
		} else {
			removeFromTakenNames(users[socket.id].name);

			users[socket.id].name = name;				
			takenNames.push(name);
			
			socket.emit('setName', {name: name});
			socket.emit('successMsg', {text: "You're name is now " + name});
		}
	});
};

var setupRoomChangeListener = function(socket, io) {
	socket.on('room', function(data) {
		var room = escapeHTML(data.room);
		
		//leave old room
		if(users[socket.id].room) {
			socket.leave(users[socket.id].room);
		}
		var usernames = getUsernamesInRoom(room, io);

		users[socket.id].room = room;
		socket.join(room);		
		socket.emit('successMsg', {text: "You're now in " + room});
		socket.emit('usersList', {usersList: usernames});
		socket.broadcast.to(room).emit('successMsg', {text: users[socket.id].name + " has joined the room"});
	});
};

var setupRoomListListener = function(socket, io) {
	socket.on('listRooms', function() {
		socket.emit('successMsg', {text: "The rooms are: "});
		for(var room in io.sockets.manager.rooms) {
			if (room != "") {
				var slicedRoom = room.slice(1, room.length);
				var numUsers = io.sockets.clients(slicedRoom).length

				io.sockets.emit('successMsg', {text: "-" + slicedRoom + " (" + numUsers + ")"});
			}
		}
	});
};

var setupDisconnectListener = function(socket) {
	socket.on('disconnect', function(){
		
		if (users[socket.id].room) {
			socket.broadcast.to(users[socket.id].room).emit('successMsg', {text: users[socket.id].name + " has left the room"});
		}		
		if(users[socket.id].name) {
			removeFromTakenNames(users[socket.id].name);
		}
		
		delete users[socket.id];
	});
};

var getUsernamesInRoom = function(room, io) {
	var socketsInRoom = io.sockets.clients(room);
	var usernames = [];
	
	for(var i = 0; i < socketsInRoom.length; i++) {
		usernames.push(users[socketsInRoom[i].id].name);
	};
	console.log(usernames);
	return usernames;
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

var escapeHTML = function(input) {
    return String(input).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

exports.createChat = createChat;