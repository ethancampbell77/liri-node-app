require("dotenv").config();

// My Spotify Keys 
var keys = require("./keys");

// Require Moment npm package be installed
var moment = require("moment");

// Require Axios npm package be installed
var axios = require("axios");

// Require Spotify API npm package be installed
var spotify = require("node-spotify-api");

// Require FS npm package to print output
var fs = require("fs");


var spotify = new spotify(keys.spotify);

var artistName = function(artist) {
    return artist.name;
  };
  
  // Function for running a Spotify search
  var mySpotify = function(songName) {
    if (songName === "") {
      songName = "Ace of Base The Sign";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(artistName));
          console.log("song name: " + songs[i].name);
          console.log("preview song: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
          console.log("-----------------------------------");
        }
      }
      
    );
  };

  var myBands = function(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
      function(response) {
        var jsonData = response.data;
  
        if (!jsonData.length) {
          console.log("No results found for " + artist + " maybe you need to find an act on tour?!");
          return;
        }
  
        console.log("Upcoming concerts for " + artist + ":");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
  
      
          console.log(
            show.venue.city +
              "," +
              (show.venue.region || show.venue.country) +
              " at " +
              show.venue.name +
              " " +
              moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    );
  };
  
  // Function for running a Movie Search
  var myMovie = function(movieName) {
    if (movieName === "") {
      movieName = "Mr Nobody";
    }
  
    var movieURL =
      "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
    axios.get(movieURL).then(
      function(response) {
        var jsonData = response.data;
  
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Rated: " + jsonData.Rated);
        console.log("IMDB Rating: " + jsonData.imdbRating);
        console.log("Country: " + jsonData.Country);
        console.log("Language: " + jsonData.Language);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
      }
    );
  };
  
  // Function for running a command based on text file
  var doWhatItSays = function() {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
  
      var dataArr = data.split(",");
  
      if (dataArr.length === 2) {
        myCommand(dataArr[0], dataArr[1]);
      } else if (dataArr.length === 1) {
        myCommand(dataArr[0]);
      }
    });
  };
  
  // Commands for Liri
var myCommand = function(caseData, functionData) {
    switch (caseData) {
    case "concert-this":
      myBands(functionData);
      break;
    case "spotify-this-song":
      mySpotify(functionData);
      break;
    case "movie-this":
      myMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  
  // Function to take command and user inputs
  var runApp = function(argOne, argTwo) {
    myCommand(argOne, argTwo);
  };
  
  runApp(process.argv[2], process.argv.slice(3).join(" "));