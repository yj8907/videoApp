"use strict";

/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var fs = require("fs");
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer')
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

var express = require('express');
var app = express();
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));


app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test called with param1 = ', request.params.p1);

    var param = request.params.p1 || 'info';

    if (param === 'info') {
        // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
        SchemaInfo.find({}, function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /user/info error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }
            if (info.length === 0) {
                // Query didn't return an error but didn't find the SchemaInfo object - This
                // is also an internal error return.
                response.status(500).send('Missing SchemaInfo');
                return;
            }

            // We got the object - return it in JSON format.
            console.log('SchemaInfo', info[0]);
            response.end(JSON.stringify(info[0]));
        });
    } else if (param === 'counts') {
        // In order to return the counts of all the collections we need to do an async
        // call to each collections. That is tricky to do so we use the async package
        // do the work.  We put the collections into array and use async.each to
        // do each .count() query.
        var collections = [
            {name: 'user', collection: User},
            {name: 'photo', collection: Photo},
            {name: 'schemaInfo', collection: SchemaInfo}
        ];
        async.each(collections, function (col, done_callback) {
            col.collection.countDocuments({}, function (err, count) {
                col.count = count;
                done_callback(err);
            });
        }, function (err) {
            if (err) {
                response.status(500).send(JSON.stringify(err));
            } else {
                var obj = {};
                obj["test"] = 1;
                for (var i = 0; i < collections.length; i++) {
                    obj[collections[i].name] = collections[i].count;
                    console.log("testnode");
                }
                response.end(JSON.stringify(obj));

            }
        });
    } else {
        // If we know understand the parameter we return a (Bad Parameter) (400) status.
        response.status(400).send('Bad param ' + param);
    }
});

/*
 * URL /admin/login - Return whether the user/password exists.
 */
app.post('/admin/login', async function (request, response) {
    var ulist = await User.find(
      {login_name: request.body.login_name, password: request.body.password}).exec();
    // if (ulist.length > 0){
    //   request.session.isUserLoggedIn = true;
    // }
    var userData = ulist.length > 0 ? {
        _id: ulist[0]._id,
        first_name: ulist[0].first_name,
        last_name: ulist[0].last_name
      } : false;
    response.status(200).send(userData);
});

app.post('/admin/logout', async function (request, response){

});

/*
 * URL /user - Check whether user exists.
 */
app.post('/user', async function (request, response) {
    var ulist = await User.find({login_name: request.body.login_name}).exec();
    if (ulist.length > 0){
      response.status(201).send(false);
    } else {
      await User.create({
        login_name: request.body.login_name,
        password: request.body.password,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        location: request.body.location,
        description: request.body.description,
        occupation: request.body.occupation
      });
      response.status(201).send(true);
    }
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', async function (request, response) {
    var ulist = await User.find({}).exec();
    response.status(200).send(ulist);
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', async function (request, response) {
    var id = request.params.id;
    var user = (await User.find({_id: id}).exec())[0];
    if (user === null) {
        console.log('User with _id:' + id + ' not found.');
        response.status(400).send('Not found');
        return;
    }
    response.status(200).send(user);
});

async function findUserForPhoto(photo)  {

  photo.comments = await Promise.all(photo.comments.map( async (comment) => {
  comment.user = await User.find({_id: comment.user_id}).exec();

  if (comment.user.length === 0){
    comment.user = {_id: "placeholder", first_name: "placeholder", last_name: "placeholder",
              location: "placeholder", description: "placeholder", occupation: "placeholder"};
  } else {
    comment.user = comment.user[0];
  }
  return comment;
    })
  );

  return photo;
}

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', async function (request, response) {
    var id = request.params.id;
    var photos = await Photo.find({user_id: id});
    photos = JSON.parse(JSON.stringify(photos));

    photos = await Promise.all(photos.map( (photo) => {
      return findUserForPhoto(photo);
    }));

    if (photos.length === 0) {
        console.log('Photos for user with _id:' + id + ' not found.');
        response.status(200).send([]);
        return;
    }
    response.status(200).send(photos);
});

/*
 * URL /commentsOfPhoto/:id - Add comments to the Photo (photo_id)
 */
 app.post('/commentsOfPhoto/:photo_id', async function(request, response){
   try {
      await Photo.findByIdAndUpdate(
        {_id: request.params.photo_id},
        {$push: {comments: request.body} }
      );
      response.status(200).send(true);
    } catch(e) {
      response.status(403).send(e);
    }
 });

 /*
* URL /photos/new - Add new photos
*/
app.post('/photos/new', processFormBody, async function(request, response){

  var user_id = request.body.user_id;
  processFormBody(request, response, function (err) {
      if (err || !request.file) {
          // XXX -  Insert error handling code here.
          return;
      }

      // request.file has the following properties of interest
      //      fieldname      - Should be 'uploadedphoto' since that is what we sent
      //      originalname:  - The name of the file the user uploaded
      //      mimetype:      - The mimetype of the image (e.g. 'image/jpeg',  'image/png')
      //      buffer:        - A node Buffer containing the contents of the file
      //      size:          - The size of the file in bytes

      // XXX - Do some validation here.
      // We need to create the file in the directory "images" under an unique name. We make
      // the original file name unique by adding a unique prefix with a timestamp.
      var timestamp = new Date().valueOf();
      // var filename = request.body.user_id + 'U' +  String(timestamp) + request.file.originalname;
      var filename = 'U' +  String(timestamp) + request.file.originalname;

      fs.writeFile("./images/" + filename, request.file.buffer, function (err) {
        // XXX - Once you have the file written into your images directory under the name
        // filename you can create the Photo object in the database
      });

      // update mongodb photo collection
      Photo.create({
        file_name: filename,
        date_time: timestamp,
        user_id: user_id
      });
      response.status(200).send(true);
  });

});


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
