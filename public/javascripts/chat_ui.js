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
		} else if (input.slice(0,6) === "/join ") {
			chat.setRoom(input.slice(6, input.length));
		} else if (input.slice(0,6) === "/rooms") {
			chat.listRooms();
		} else {
			chat.sendMessage(input);
		}
	};

	var setupSocketListeners = function() {
	  socket.on('normalMsg', function (data) {
			$('#chat-log').append("<p>" + data['text'] + "</p>");
			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
	  });

	  socket.on('warningMsg', function (data) {
			$('#chat-log').append("<p class='warning'>" + data['text'] + "</p>");
			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
	  });

	  socket.on('successMsg', function (data) {
			$('#chat-log').append("<p class='success'>" + data['text'] + "</p>");
			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
		});
		
		socket.on('setName', function (data){
			username = data.name;
		});
	};

	$(document).ready(function() {
		chat = new Chandom.Chat(socket);

		$('#chat-log').append("<p class='success'>Welcome to Chandom! Please choose a username.</p>");

		setupSocketListeners();
		
		$("#chat-input").keyup(function(event){
			if(event.keyCode == 13){
	      handleInput();
	    }
		});
		
		$("#send-input").click(function() {
			handleInput();
		});
	});
})(this);