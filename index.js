// express initialises app to be a function handler that you can supply to a HTTP server
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// define a route handler / that gets called when we hit website home
app.get("/", function(req, res) {
	// res.send("<h1>Hello world</h1>");
	// Instead of sending all the HTML code, send a HTML file
	// __dirname is a node js global object which is the directory name of the current module
	res.sendFile(__dirname + "/index.html");
});

var clientsOnline = [];
io.on("connection", function(socket){

	var userName;
	socket.on("init", function(name) { // when user enters name this is sent to server
		userName = name;
		console.log(userName + " connected");

		var valid = 1;
		if(clientsOnline.indexOf(name) > -1) {
			valid = 0;
			console.log(name + " not a valid name- already taken");
		}else {
			socket.broadcast.emit("user connect", name); // send to all clients except this one
			clientsOnline.push(name);
			console.log(clientsOnline.length + " clients connected");

			io.emit("update online", JSON.stringify(clientsOnline)); // send to all clients (including this one) - updates the online list
		}
		socket.emit("name taken", valid); // send to only the current client - to say whether the chosen name is valid or not

	});

	socket.on("chat message", function(data) {
		console.log("Message data: " + data);
		// io.emit("chat message", msg);
		socket.broadcast.emit("chat message", data);
	});

	socket.on("typing", function(person) {
		socket.broadcast.emit("typing", person);
	});

	socket.on("stopTyping", function(person) {
		socket.broadcast.emit("stopTyping", person);
	});
	socket.on("disconnect", function() {
		console.log(userName + " disconnected");
		var index = clientsOnline.indexOf(userName);

		if(index > -1) {
			clientsOnline.splice(index, 1);
		}

		console.log(clientsOnline.length + " clients connected");
		io.emit("update online", JSON.stringify(clientsOnline));
		socket.broadcast.emit("user disconnect", userName);
	});
});

// Make the http server listen on port 3000
http.listen(3000, function() {
	console.log("Listening on *:3000");
});
