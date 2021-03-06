(function(root) {
	var Chandom = root.Chandom = (root.Chandom || {});
	var socket = io.connect();
	var username;

	$(document).ready(function() {
		chat = new Chandom.Chat(socket);
		appendMessage('success', 'Please choose a username.')

		setupSocketListeners();
		setupKeyListeners();

		$("#chat-input").focus();
	});
		
	var setupKeyListeners = function() {
		$("#chat-input").keyup(function(event){
			if(event.keyCode == 13){
	      handleInput();
	    }
		});
		
		$("#send-input").click(function() {
			handleInput();
		});
	};

	var setupSocketListeners = function() {
	  socket.on('normalMsg', function (data) {
			$('#chat-log').find('p').removeClass('last-line');

			var $randomLine = pickRandomLine();
			$("<p class='chat-line last-line'>" + data['text'] + "</p>").insertAfter($randomLine);
			$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
			
			moveShinChan();
	  });

	  socket.on('warningMsg', function(data) {
			appendMessage('warning', data['text']);			
	  });

	  socket.on('successMsg', function(data) {
			appendMessage('success', data['text']);
		});
		
		socket.on('setName', function(data){
			username = data.name;
		});

		socket.on('roomsList', function(data){
			console.log(data);
			if (data.rooms.length === 0) {
				appendMessage('warning', 'There are currently no rooms. Please make one with /join');
			} else {
				appendMessage('success', 'The rooms are:');
				for (var i = 0; i < data.rooms.length; i++) {
					appendMessage('success', '-' + data.rooms[i].name + ' (' + data.rooms[i].numUsers + ')');
				}
			}
		});
		
		socket.on('usersList', function(data){
			if (data.usersList.length > 0) {
				appendMessage('success', 'Users in this room:');

				for (var i = 0; i < data.usersList.length; i++) {
					appendMessage('success', '*' + data.usersList[i]);
				}
			} else {
				appendMessage('warning', 'The room is currently empty!');
			}
		});
	};
		
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
		} else if (input.slice(0,11) === "/disconnect") {
			chat.disconnect();
			appendMessage('warning', "You are now disconnected");
		} else if (input.slice(0,1) === "/") {
			appendMessage('warning', "That is not a valid command!");
		} else {
			chat.sendMessage(input);
		}
	};

	var appendMessage = function(msgClass, text) {
		$('#chat-log').append("<p class='chat-line " + msgClass + "'>" + text + "</p>");
		$("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);
	};

	var pickRandomLine = function() {
		var randomNumber = Math.floor(Math.random() * ($('#chat-log').find('p').length) + 1);
		return $("#chat-log").find("p:nth-child(" + randomNumber + ")");
	};

	var moveShinChan = function() {
		$('#shin-image').offset({top: $(".last-line").offset().top - 60});
	};
})(this);