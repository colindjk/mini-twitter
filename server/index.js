var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
app.use(morgan('dev'));
app.use(express.static('./client'));
app.use(bodyParser.text());

var net = require('net');
var HOST = '127.0.0.1';
var PORT = 8080;

var tcpstream = new net.Socket();
tcpstream.connect(PORT, HOST, function() {
});

// Add a 'close' event handler for the client socket
tcpstream.on('close', function() {
    console.log('Connection closed');
});

var logginInUser = null;  // Currently logged in user.
var currentUser = null;   // Current user I'm talking to.
var users = [];           // Recently spoken to users.

function User(user_id) {
  this.username = user_id;
  this.friends = {};
  users.push(this);
}

// holds information on the actual tweet
function Message(body) {
  this.msg = body;
  this.to = currentUser.user_id;
  this.from = currentlyLoggedIn.user_id;
}

function addFriend(user_id) {
  console.log(user_id);
  currentUser.friends[user_id] = [];

  return user_id;
}

// --- Server handlers start here

app.get('/login/:user', function(req, res, next) {
  var username = req.params.user;

  currentlyLoggedIn = User(username);
  res.json(currentlyLoggedIn);

  //res.status(200).json({});
});

app.get('/users/:user', function(req, res, next) {
  var username = req.params.user;

  currentUsername = username;
  res.json(currentlyLoggedIn.friends[currentUsername]);

  //res.status(200).json({});
});

app.get('/users', function(req, res, next) {

  res.json(currentlyLoggedIn);

  //res.status(200).json({});
});

app.post('/users/:user/follow', function(req, res, next) {
  var followUsername = req.body;

  var messages = currentlyLoggedIn[followUsername];

  res.status(200).json(textify(user));
});

app.post('/users/:user/tweet', function(req, res, next) {
  var message = new Message(req.body);

  currentlyLoggedIn.friends[currentUsername].unshift(message);

  res.status(200).json(message);
});

app.post('/users/:user/favorite', function(req, res, next) {
  //var username = req.params.user;

  // TODO

  res.status(200).json({});
});

app.post('/users/:user/retweet', function(req, res, next) {

  //console.log(req.body);
  //console.log(currentlyLoggedIn.timeline[0].tweetObject);
  //for (var i = 0; i < currentlyLoggedIn.timeline.length &&
    //currentlyLoggedIn.timeline[i].tweetObject.id !== req.body; i++);

  //var retweet = currentlyLoggedIn.timeline[i - 1];

  //retweet.isRetweet = true;

  //currentlyLoggedIn.timeline.unshift(newTweet);

  //for (var j = 0, len = currentlyLoggedIn.followers.length; i < len; i++) {
    //currentlyLoggedIn.followers[i].timeline.unshift(newTweet);
  //}

  res.status(200).json({});
});


app.listen(3000);
