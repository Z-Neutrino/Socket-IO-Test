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

io.on("connection", function(socket){
	console.log("A user connected");

	socket.on("chat message", function(msg) {
		console.log("message: " + msg);
		io.emit("chat message", msg);
	});

	socket.on("disconnect", function() {
		console.log("user disconnected");
	});
});

// Make the http server listen on port 3000
http.listen(3000, function() {
	console.log("Listening on *:3000");
});
