var bodyParser = require('body-parser');
var path = require('path');
var bluebird = require('bluebird'); 
var url = require('url');
var db = require('../db/config.js');
var Users = require('../db/collections/users');
var User = require('../db/models/user');

var Arc = require('../db/models/arc'); 
var Arcs = require('../db/collections/arcs'); 

var Image = require('../db/models/image.js');
var Images = require('../db/collections/images.js');

var helpers = require('../helpers.js');

var limit = 5;

module.exports.main = {
  get: function (req, res) {
    res.redirect('/signin'); 
  }
}; 

module.exports.signin = {
  get: function (req, res) {
    res.sendFile(path.normalize(__dirname + '/../../public/index.html')); 
  }, 

  post: function (req, res) {
    // console.log('post request', req.body); 
    Users.reset()
      .query({where: {fbId: req.body.userId}})
      .fetch()
      .then(function (allUsers) {
        if (allUsers.length > 0) {
          // this needs to update database and not just console log
          console.log('This username, ' + req.body.userId + ' already exists in the database');
        } else {
          new User({name: req.body.name, fbId: req.body.userId, access_token: req.body.access_token})
          .save()
          .then(function(data){
            // console.log('user should have saved', data); 
          });
        }
        res.writeHead(201); 
        // res.redirect('/dashboard'); // How do you redirect to React path? 
        res.end(); 
      }); 
  }
}; 

module.exports.create = {
  get: function (req, res) {
    res.send('success'); 
  }, 

  post: function (req, res) {
    // store obj from fb api calls into db
    console.log("post request from client", req.body.photos.data.length);
    var imgUrl = helpers.minimizeAndRandArr(req.body.photos.data, limit);
      // user has already been created
        User.forge({fbId: req.body.id})
          .fetch()
          .then(function (userMatched) {
            // make new arc
            var arc = new Arc({
              name: Date()
            });
            return arc.save({user_id: userMatched.id});
          })
          .then(function (newArc) {
            console.log("Images in arc =>", imgUrl);

          // store img into new arc
            for (var imgId = 0; imgId < imgUrl.length; imgId++) {
              var imgSizeArr = imgUrl[imgId].images;
              // for (var imgSize = 0; imgSize < imgSizeArr.length; imgSize++) {
                // var img = imgSizeArr[imgSize];
                var img = imgSizeArr[0];
                console.log("Img instance", img);
                var image = new Image({
                  height: img.height,
                  width: img.width,
                  url: img.source
                });

                image.save({arc_id: newArc.id});
                // console.log("A new img has been added => ", image);
              // }
            }
          });
    res.send('success'); 
  }
}

module.exports.dashboard = {
	get: function(req, res) {
		var url_parts = url.parse(req.url, true);
		var userId = url_parts.query.user_id;
    var results = [];
    User.forge({fbId: userId})
      .fetch()
      .then(function (userMatched) {
        Arcs.reset()
          .query({where: {user_id: userMatched.id}})
          .fetch()
          .then(function (arcMatched) {
            // make array of matching arc id
            // Images.reset();
            // for (var arcNo = 0; arcNo < arcMatched.length; arcNo++) {
              // results.push([]);
              (function next(index) {
                  if (index === arcMatched.length) {
                  	res.json(results);
                  	return;
                  }
                  Images.reset()
                    .query(function (qb) {
                      qb.where('arc_id', '=', arcMatched.models[index].id);
                    })
                    .fetch()
                    .then(function (imageMatched) {
											console.log('for index...', index) 
											// console.log('full imageMatched is...', imageMatched)                      
                      // loop through all images in each arc
                      result = [];
                      for (var img = 0; img < imageMatched.length; img++) {
                        // console.log('All images in this arc =>', imageMatched.models[img].attributes.url, 'here is n =>', n);
                        
                        result.unshift({thumbnail: imageMatched.models[img].attributes.url, src: imageMatched.models[img].attributes.url, arcId: imageMatched.models[img].attributes.arc_id});
                      }
                      results.push(result);
                      next(index + 1);
                    })
              }) (0);
            });
          })
      }

		// console.log('query is an object as: ', );
		// res.send('success');
}; 