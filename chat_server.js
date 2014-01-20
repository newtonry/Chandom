var socketio = require('socket.io')	
var takenNames = [];
var usernames = {};
	
var createChat = function(server) {
	var io = socketio.listen(server);
	
	io.sockets.on('connection', function(socket){
		// socket.emit('update', {text: "You have joined!"});
		socket.emit('successMsg', {text: "Please choose a name:"});
		
		//setup a socket waiting for 'name'
		socket.on('name', function (data) {
			console.log(indexOf(data.name, takenNames))
			if (indexOf(data.name, takenNames) != -1) {
				socket.emit('warningMsg', {text: data.name + " is already taken! Please choose another name."});
			} else {
				removeFromTakenNames(usernames[socket.id]);
				
				usernames[socket.id] = data.name;				
				takenNames.push(data.name);

				socket.emit('setName', {name: data.name});
				socket.emit('successMsg', {text: "You're name is now " + data.name});
			}
		});
		
	  // io.sockets.emit('update', {text: "A new person has joined!"});
		
		// socket.on('message', function (data) {
		// 	    io.sockets.emit('update', data);
		// 	console.log(takenNames);
		// 	console.log(data);
		// 	  });
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
	console.log(value);
	console.log(arr);
		
	for(var ind=0; ind < arr.length; ind++) {
		if (arr[ind] === value) {
			return ind;
		}
	}
	return -1;
};


exports.createChat = createChat;