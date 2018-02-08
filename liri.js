var keys = require("keys.js");
var Twitter = require('twitter')
var Spotify = require('node-spotify-api');

var service = process.argv[2];
var nodeInput = process.argv;


function liri (service, input) {
	switch (service) {
		case "my-tweets":
		myTweets(parseName(input));
		logIt(service, parseName(input));
		break;

		case "spotify-this-song":
		spotifyThisSong(parseName(input));
		logIt(service, parseName(input));
		break;

		case "movie-this":
		movieThis(parseName(input));
		logIt(service, parseName(input));
		break;

		case "do-what-it-says":
		doWhatItSays();
		logIt(service, parseName(input));
		break;

		default:
		console.log("Please pick one of the following operations: my-tweets, spotify-this-song, movie-this, do-what-it-says");
		break;
	};
};

function parseName(name) {

	var input = name;
	
	if (typeof input === "string") {
		return input;
	} else if (process.argv[3]) {
		var parsedName = "";
		// populate parsedName
		for (var i = 3; i < input.length; i++) {
			if (i > 3 && i < input.length) {
				parsedName = parsedName + " " + input[i];
			} else {
				parsedName += input[i];
			};
		};
		return parsedName;
	} else {
		var parsedName = null;
		return parsedName;
	};
};

function myTweets (username) {
	var Twitter = require("twitter");

	var twitterKeys = keys.twitterKeys;
	var client = new Twitter(twitterKeys);
	
	if (username) {
		var screenName = username;
	} else {
		var screenName = "noahstrayve";
	};

	var params = {screen_name: screenName};
	

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			console.log(`@noahstrayve's 20 most recent tweets are:`);
			tweets.forEach(function(tweet) {
				console.log("");
				console.log("==============================");
				console.log(tweet.created_at);
				console.log(tweet.text);
				console.log("==============================");
			});
			console.log("");
			console.log(`Please scroll up to see @noahstrayve's 20 most recent tweets:`);
		};
	});
};

function spotifyThisSong(name) {

	var songName = name;

	if (!songName) {
		var songName = "The Sign Ace of Base";
	};

	var Spotify = require("node-spotify-api");
	var spotifyKeys = keys.spotifyKeys;
	var spotify = new Spotify(spotifyKeys);

	spotify.search({ type: "track", query: songName }, function(error, data) {
		if (error) {
			return console.log(`error occurred: ${error}`);
	};

		var songName = data.tracks.items[0].name;
		var albumName = data.tracks.items[0].album.name;

		var allArtists = data.tracks.items[0].artists;
		var songArtists = "";

		allArtists.forEach(function(i) {
			songArtists += (i.name + ", ");
		});

		songArtists = songArtists.substring(0, songArtists.length - 2);


		console.log("");
		console.log("==============================");
		console.log(`Song Name: ${songName}`);
		console.log(`Artist(s): ${songArtists}`);
		console.log(`Album Name: ${albumName}`);

		var previewUrl = data.tracks.items[0].preview_url;
		if(previewUrl) {
			console.log(`Preview Link: ${previewUrl}`);
		} else {
			console.log("Preview URL unavailable for this song.")
		};
		console.log("==============================");

	});
};

function movieThis(name) {

	var movieName = name;

	if (!movieName) {
		var movieName = "The Big Lebowski";
	};

	var request = require("request");

	var apiKey = keys.omdbKey;

	var queryURL = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${apiKey}`;

	request(queryURL, function(error, response, body) {
		if(!error && response.statusCode === 200) {
			var data = JSON.parse(body);

			var movieTitle = data.Title;
			var movieActors = data.Actors;
			var movieYear = data.Year;
			var imdbRating = data.imdbRating;
			var movieCountry = data.Country;
			var movieLanguage = data.Language;
			var moviePlot = data.Plot;

			if(data.Ratings[1].Source === "Rotten Tomatoes") {
				var rottenTomatoesRating = data.Ratings[1].Value;
			} else {
				var rottenTomatoesRating = "Unavailable"
			};

			console.log("");
			console.log("==============================");
			console.log(`${movieTitle} (${movieYear})`);
			console.log(`Starring: ${movieActors}`);
			console.log(`IMDb Rating: ${imdbRating}/10`);
			console.log(`Rotten Tomatoes Rating: ${rottenTomatoesRating}`);
			console.log(`This movie was produced in: ${movieCountry}`);
			console.log(`Language(s): ${movieLanguage}`);
			console.log(`Plot: ${moviePlot}`);
			console.log("==============================");
		};
	});
}; 

function doWhatItSays() {
	var fs = require("fs");

	if (process.argv[3]) {
		var fileName = process.argv[3];
	} else {

		var fileName = "random.txt";
	};

	fs.readFile(fileName, "utf8", function(error, data) {
		if(error) {

			console.log("Please input a proper file name.");
		} else {
			var dataArray = data.split(",")
			var dataService = dataArray[0];
			var dataName = dataArray[1];
			var cleanName = dataName.substring(1, dataName.length - 1);

			liri(dataService, cleanName);
		};
	});
};

function logIt (service, input) {
	var fs = require("fs");
	fs.appendFile("log.txt", `==============================\nservice: ${service}\ninput: ${input}\n==============================\n`, function() {
		console.log("Input logged.")
	});
};

liri(service, nodeInput);