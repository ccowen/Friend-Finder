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

// functions
// =============================================================
function subtractScores(input1, input2) {

	var difference;

	for (var i = 0; i <= 10; i++) {
		difference += input1.scores[i] - input2.scores[2]
	};

	return parseInt(difference);
	
};

var lowestScore;
var lowestScoreArrayNumber;

function findLowestScore(newData, allData) {
	console.log(allData);

	// find the first difference, for now this is the lowest
	var firstScore = subtractScores(newData, allData[0]);
	// set the first score as the lowest score variable
	lowestScore = firstScore;
	lowestScoreArrayNumber = 0;

	// compare all difference, see if there is a lower score
	for (var i = 1; i <= allData.length; i++) {
		var compareScore = subtractScores(newData, allData[i]);

		if (compareScore < lowestScore) {
			lowestScore = compareScore;
			lowestScoreArrayNumber = [i];
		};

	};

	//after the loop is complete, the var lowestscore should be the lowest score and lowestScoreArrayNumber should identify the best match

};

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

  var file = './app/data/friends.js';

  // var currentData;
 
  jsonfile.readFile(file, function(err, obj) {
	  console.log(obj);

	  // currentData = obj;

  	  obj.push(newForm);

  	  jsonfile.writeFile(file, obj, function(err) {
	  	console.log(err);

	  	console.log(obj , "obj");

	    findLowestScore(newForm, obj);

	  	console.log(findLowestScore(newForm, obj));
	  	
	  });

	});

	  


  res.json(newForm);



});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});