(function(root) {
	var Chandom = root.Chandom = (root.Chandom || {});
	var socket = io.connect();
	var username;
	
		
	var handleInput = function() {
		var input = $("#chat-input").val();
		$("#chat-input").val('');
		
		if (!username) {
			chat.setName(input);
		} else if (input.slice(0,6) === "/name ") {
			chat.setName(input.slice(6, input.length));
		} else if (input.slice(0,6) === "/room ") {
			chat.setRoom(input.slice(6, input.length));
		} else {
			chat.sendMessage(input);
		}
		
	}


	var setupSocketListeners = function() {
	  socket.on('normalMsg', function (data) {
			$('#conversation').append("<p>" + data['text'] + "</p>")
	  });

	  socket.on('warningMsg', function (data) {
			$('#conversation').append("<p class='warning'>" + data['text'] + "</p>")
	  });

	  socket.on('successMsg', function (data) {
			$('#conversation').append("<p class='success'>" + data['text'] + "</p>")
		});
		
		socket.on('setName', function (data){
			username = data.name;
		});
		
		
	};

	$(document).ready(function() {
		chat = new Chandom.Chat(socket);

		$('#conversation').append("<p class='success'>Welcome to Chandom! Please choose a username.</p>");

		setupSocketListeners();
		
		$("#send-input").click(function() {
			handleInput();
		});
		
		
		
	});
})(this);