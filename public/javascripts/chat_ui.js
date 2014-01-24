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
			$('#chat-log').find('p').removeClass('last-line');

			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
			var $randomLine = pickRandomLine();
			$("<p class='chat-line last-line'>" + data['text'] + "</p>").insertAfter($randomLine);
	  });

	  socket.on('warningMsg', function (data) {
			$('#chat-log').append("<p class='chat-line warning'>" + data['text'] + "</p>");
			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
	  });

	  socket.on('successMsg', function (data) {
			$('#chat-log').append("<p class='chat-line success'>" + data['text'] + "</p>");
			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
		});
		
		socket.on('setName', function (data){
			username = data.name;
		});
	};

	var pickRandomLine = function() {
		var randomNumber = Math.floor(Math.random() * ($('#chat-log').find('p').length) + 1);
		return $("#chat-log").find("p:nth-child(" + randomNumber + ")");
	};

	$(document).ready(function() {
		chat = new Chandom.Chat(socket);

		$('#chat-log').append("<p class='chat-line success'>Welcome to Chandom! Please choose a username.</p>");

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