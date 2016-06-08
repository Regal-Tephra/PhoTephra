const Clarifai = require('clarifai');
const key = require('../../keys.js');

const client = new Clarifai({
  id: key.clarifaiClientID,
  secret: key.clarifaiClientSecret,
});

const helpers = require('./helpers.js');

const testImages = [
  "http://i.imgur.com/FWGpCuk.jpg",
  "http://media.galaxant.com/000/108/061/desktop-1421344897.jpg",
];

helpers.getTagsFromClarifai(testImages);
