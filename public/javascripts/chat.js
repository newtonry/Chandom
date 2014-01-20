(function(root) {
	var Chandom = root.Chandom = (root.Chandom || {});
	
	var Chat = Chandom.Chat = function(socket) {
		this.socket = socket;
		
	};
	
	Chat.prototype.sendMessage = function(message) {
		this.socket.emit('message', { text: message });
	};
	
	Chat.prototype.setName = function(message) {
		this.socket.emit('name', { name: message });
	};
	
})(this)