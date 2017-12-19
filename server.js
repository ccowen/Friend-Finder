// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var fs = require("fs");
var jsonfile = require('jsonfile');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/survey", function(req, res) {
	res.sendFile(path.join(__dirname, "public/survey.html"));
});

// Get all friends
app.get("/all", function(req, res) {
	// get friends from its file
	res.sendFile(path.join(__dirname, "app/data/friends.js"));
});

// Create New Characters - takes in JSON input
app.post("/api/new", function(req, res) {

	var newForm = req.body;

	console.log(newForm);

	var file = 'app/data/friends.js';

	var obj = newForm;

	jsonfile.writeFile(file, obj, { flag: 'a' }, function(err) {
		console.error(err)
	});

	var pastResults;

	jsonfile.readFile(file, function(err, obj) {
		pastResults = obj;
	});

	modal.style.display = "block";

	$("$modalLowestScoreName").html(pastResults);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
	console.log("App listening on PORT " + PORT);
});