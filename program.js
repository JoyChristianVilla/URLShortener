var mongoose = require('mongoose')
var shortid = require('shortid')
var validator = require('validator')
var express = require('express');
var app = express();

var Url = require('./models/url')

mongoose.connect('mongodb://localhost/short-url')

app.get('/new/*?', function (req, res) {
  if (!validator.isURL(req.params[0])) {
    return res.send({ error: 'Not a valid URL' })
  } else {
    Url.findOne({ original: req.params[0] }, function(err, url) {
      if (url) {
        res.send(url);
      } else {
        var response = new Url({
          original: req.params[0],
          shortcode: 'localhost:3000/' + shortid.generate()
        })
        response.save(function(err) {
          if (err) return res.send({ err: err })
          res.send(response)
        });
      }
    });
  }
});

app.get('/:code', function(req, res) {
   Url.findOne({ shortcode: 'localhost:3000/' + req.params.code }, function(err, url) {
     if (url) {
       return res.redirect(url.original);
     } else {
       res.send({ error: "This url is not on the database." });
     }
   });

})

app.listen(3000, function() {
  console.log('Congregation is running on port 3000');
});


/*

1. Client makes a rquest using /new/:url
2. Check the database if req.params.url exists
  (validate the input, if invlaide then respond with err, otherwise continue)
  a. if it exists, return db record to the Client
  b. if it doesn:t exist, create a new record and then return it to client

3. ('/:shortcode') /visit/74k20az
  a. check the db for the shortcode
    i. redirect the client to original url
    ii. respond with an error (shortcode does not exist in db)
*/
