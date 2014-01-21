(function(root) {
	var Chandom = root.Chandom = (root.Chandom || {});
	
	var Chat = Chandom.Chat = function(socket) {
		this.socket = socket;
	};
	
	Chat.prototype.sendMessage = function(message) {
		this.socket.emit('message', { text: message });
	};
	
	Chat.prototype.setName = function(name) {
		this.socket.emit('name', { name: name });
	};

	Chat.prototype.setRoom = function(roomname) {
		this.socket.emit('room', { room: roomname });
	};
	
	Chat.prototype.listRooms = function() {
		this.socket.emit('listRooms');
	};
})(this);