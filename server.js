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
function getRandomInt(min, max) {

	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive

};

function subtractScores(input1, input2) {

	var difference = 0;

	for (var i = 0; i < 10; i++) {
		difference += Math.abs(parseInt(input1.scores[i]) - parseInt(input2.scores[i]));
	};

	return parseInt(difference);
	
};

var lowestScore;
var lowestScoreArrayNumber;

// function to find the lowest score in comparision to new data
function findLowestScore(newData, allData) {

	// find the first difference, for now this is the lowest
	var firstScore = subtractScores(newData, allData[0]);

	// set the first score as the lowest score variable
	var lowestScore = firstScore;
	var lowestScoreArrayNumber = 0;

	// compare all difference, see if there is a lower score
	for (var i = 1; i < allData.length - 1; i++) {
		var compareScore = subtractScores(newData, allData[i]);

		if (compareScore < lowestScore) {
		 	lowestScore = compareScore;
		 	lowestScoreArrayNumber = [i];

		 	console.log("THIS IS NOW THE LOWEST SCORE " + lowestScore + " ARRAY NUMBER " + lowestScoreArrayNumber);

		}

		// ---- else if the scores are equal, randomize who will be matched, will not always move to the most recent matching result
		else if (compareScore == lowestScore) {
			var randomInt = getRandomInt(1, 100);
			if (randomInt >= 27) {
				lowestScore = compareScore;
			 	lowestScoreArrayNumber = [i];

			 	console.log("THIS IS NOW THE LOWEST SCORE " + lowestScore + " ARRAY NUMBER " + lowestScoreArrayNumber);
			};

		};

		//after the loop is complete, the var lowestscore should be the lowest score and lowestScoreArrayNumber should identify the best match

	};

	return lowestScoreArrayNumber;


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

  // get the survey form
  var newForm = req.body;

  // file to add survey data to
  var file = './app/data/friends.js';

  // declare variable for the closet match
  var lowestScoreArrayNumber;
 
  // read the file with the data
  jsonfile.readFile(file, function(err, obj) {

  	  obj.push(newForm);

  	  // write the new data to the form
  	  jsonfile.writeFile(file, obj, {spaces: 2, EOL: '\r\n'}, function(err) {
	  	console.log(err);

	  	// find the lowest score in comparision to the newForm 
	    lowestScoreArrayNumber = findLowestScore(newForm, obj);

	    // content to put into modal
	    var resultDataForModal = "<p class='flow-text'>" +
			  	"<img id='modalLowestScorePicture' src='" + obj[lowestScoreArrayNumber].photo + "'>" +
			  	"<br>Name: <span id='modalLowestScoreName'>" + obj[lowestScoreArrayNumber].name + "</span>" +
			  "</p>";

		// send to front end
	    res.send(resultDataForModal);

	  });

	});

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});