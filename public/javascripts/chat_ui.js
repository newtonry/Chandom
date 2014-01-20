(function(root) {
	var Chandom = root.Chandom = (root.Chandom || {});
	var socket = io.connect();
	var username;
	
		
	var handleInput = function() {
		var input = $("#chat-input").val();
		$("#chat-input").val('');
		chat.setName(input);
		
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
			debugger
		});
		
		
	};

	$(document).ready(function() {
		chat = new Chandom.Chat(socket);

		setupSocketListeners();
		
		$("#send-input").click(function() {
			handleInput();
		});
		
		
		
	});
})(this)