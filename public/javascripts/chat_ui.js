(function(root) {
	var Chandom = root.Chandom = (root.Chandom || {});
	var socket = io.connect();
		
	var handleInput = function() {
		var input = $("#chat-input").val();
		$("#chat-input").val('');
		chat.sendMessage(input);
		
	}

	$(document).ready(function() {
		chat = new Chandom.Chat(socket);
		
		$("#send-input").click(function() {
			handleInput();
		});
		
	  socket.on('update', function (data) {
			$('#conversation').append("<p>" + data['text'] + "</p>")
	  });
	});
})(this)