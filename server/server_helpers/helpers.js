const _ = require('lodash');
const Clarifai = require('clarifai');
const key = require('../../keys.js');

const client = new Clarifai({
  id: key.clarifaiClientID,
  secret: key.clarifaiClientSecret,
});

// take an array and return arr selecting only =limit # of elements
module.exports.minimizeAndRandArr = (arr, targetLength) => {
  const totalLen = arr.length;
  const di = totalLen / targetLength;
  const results = [];

  if (totalLen <= targetLength) {
    return arr;
  }
  for (let i = 0; i < totalLen; i += di) {
    const ind = Math.floor(i + Math.floor(Math.random() * di));
    console.log(ind);
    results.push(arr[ind]);
  }
  return results;
};

// OLD: Takes an array of photos and return an array w/ attributes
module.exports.createArrayOfPhotos = (imageArray) => {
  const result = [];
  for (let img = 0; img < imageArray.length; img++) {
    result.unshift({
      thumbnail: imageArray.models[img].attributes.url,
      src: imageArray.models[img].attributes.url,
      arcId: imageArray.models[img].attributes.arc_id,
    });
  }
  return result;
};

// Get Tags from Clarifai and return array with photos
module.exports.getTagsFromClarifai = (photoArray) => {
  // TODO: COMPLETE FUNCTION
  // Input: Takes an array of photos
    // Send ajax request to Clarifai server in its required format
  let returnArray = [];
  // Get new access token
  // client.getAccessToken((err, accessToken) => {
  //   if (err) {
  //     console.log("Error in accessing Clarifai token", err);
  //     return;
  //   }
  //   // TODO: Photo Array May need cleaning up
  const arrayOfPhotos = photoArray;
  client.tagFromUrls('image', arrayOfPhotos, (err1, results) => {
    if (err1) {
      console.log('Error in getting images from Clarifai', err1);
      return;
    }
    console.log("Results from Clarifai", results);
    // Clean up each photo and return replace new array
    returnArray = _.map(results.tags, (photo) => {
      const newPhoto = photo;
      // add the URL of the photo along that was sent
      newPhoto.url = photoArray.url;
      // Also, remove the concept ID. We don't need it
      delete newPhoto.conceptId;
      return newPhoto;
    });
  });
  // });
  // Returns array of photos with tags from clarifai
  return returnArray;
};

// Classify photo based
module.exports.classifyPhoto = (photoObj, categories) => {
  // TODO: Complete Function
  // Takes in an object or array of categories
    // Create a new object with a score of each category
    // Only check scores that are >15%
    // Goes through photo tags and looks for matches in the categories object
    // If there's a match, then add probability / score to the score/array

  // Return object with the original photo and most relevant category
};

// Helper Functions that I need
  // Get the facebook photos that I need from the array Andy is sending me
    // PENDING: May already have from createArrayofPhotos Helper

