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
		difference += parseInt(input1.scores[i]) - parseInt(input2.scores[i]);
	};

	return parseInt(difference);
	
};

var lowestScore;
var lowestScoreArrayNumber;

function findLowestScore(newData, allData) {
	console.log(allData, "this is all data in the lowestscore function");
	console.log(newData);

	console.log("subtractScores in lowestscore function" + subtractScores(newData, allData[0]));

	// find the first difference, for now this is the lowest
	var firstScore = subtractScores(newData, allData[0]);

	console.log("FIRSTSCORE" + firstScore);

	// set the first score as the lowest score variable
	var lowestScore = firstScore;
	var lowestScoreArrayNumber = 0;

	// compare all difference, see if there is a lower score
	for (var i = 1; i < allData.length; i++) {
		var compareScore = subtractScores(newData, allData[i]);

		if (compareScore < lowestScore) {
		 	lowestScore = compareScore;
		 	lowestScoreArrayNumber = [i];

		 	console.log("THIS IS NOW THE LOWEST SCORE " + lowestScore + " ARRAY NUMBER " + lowestScoreArrayNumber);

		};

		// ---- can write an else if the scores are equal
		// else if (compareScore < lowestScore) {
		// 	if 
		// }

		//after the loop is complete, the var lowestscore should be the lowest score and lowestScoreArrayNumber should identify the best match

		console.log("THIS IS NOW THE LOWEST SCORE " + lowestScore + " ARRAY NUMBER " + lowestScoreArrayNumber);


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

  var newForm = req.body;

  console.log(newForm);

  var file = './app/data/friends.js';

  // var currentData;
 
  jsonfile.readFile(file, function(err, obj) {
	  console.log("FIRST CONSOLE LOG OBJ" + obj);

	  // currentData = obj;

  	  obj.push(newForm);

  	  jsonfile.writeFile(file, obj, function(err) {
	  	console.log(err);

	    var lowestScoreArrayNumber = findLowestScore(newForm, obj);

	    console.log(obj[lowestScoreArrayNumber]);
	    console.log(obj[lowestScoreArrayNumber].name);
	    console.log(obj[lowestScoreArrayNumber].photo);


	  });

	});

	  


  res.json(newForm);



});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});