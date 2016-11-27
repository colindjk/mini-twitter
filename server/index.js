var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
app.use(morgan('dev'));
app.use(express.static('./client'));
app.use(bodyParser.text());

var currentUser = null;
var users = [];

function User(username) {
  this.username = username;
  this.timeline = [];
  this.followers = [];
  this.followees = [];//not necessary?
  users.push(this);
}

function TweetWrapper(tweet, isRetweet) {
  if (!isRetweet)
    this.retweet = false;
  else
    this.retweet = true;
  this.tweetObject = tweet;
}

// holds information on the actual tweet
function Tweet(twit) {
  this.id = Math.floor(Math.random() * (1000000 - 100000) + 100000);
  this.tweet = twit;
  this.username = currentUser.username;
  this.date = Date();
  this.favorites = 0;
}
users.verifyUser = function(username) {
  if (!username)
    return;
  for (var i = 0, len = users.length; i < len; i++) {
    if (users[i].username === username) {
      return i;
    }
  }

  var newUser = new User(username);
  users.push(newUser);
  return users.length - 1;
};

// Returns a text based username to return to client.
// This way the data can be serialized!
function getTextUser() {
  if (currentUser === null) {
     users.verifyUser("Colin");
     currentUser = users[0];
  }
  return {
    username: currentUser.username,
    timeline: currentUser.timeline,
    following: currentUser.followees.map(function (cur) {
      return { username: cur.username }; //cur.username;
    }),
    followers: currentUser.followers.map(function (cur) {
      return { username: cur.username }; //cur.username;
    }),
    tweet: function(content) { // This is ugly
      return false;
    }
  };
}

// Returns a text based username to return to client.
// This way the data can be serialized!
function textify(user) {
  return {
    username: user.username,
    timeline: user.timeline,
    following: user.followees.map(function (cur) {
      return cur.username;
    }),
    followers: user.followers.map(function (cur) {
      return cur.username;
    }),
    tweet: function(content) { // This is ugly
      return false;
    }
  };
}

function follow(username) {
  var followerUserIndex = users.verifyUser(username);
  followerUser = users[followerUserIndex];
  if (username === currentUser.username)
    return;

  console.log(followerUser);
  currentUser.followees.push(followerUser);
  followerUser.followers.push(currentUser);

  return followerUser;
}


// --- Server handlers start here

app.get('/users/:user', function(req, res, next) {
  var username = req.params.user;

  currentUser = users[users.verifyUser(username)];
  res.json(getTextUser());

  //res.status(200).json({});
});

app.get('/users', function(req, res, next) {

  res.json(getTextUser());

  //res.status(200).json({});
});

app.post('/users/:user/follow', function(req, res, next) {
  var followUsername = req.body;

  var user = follow(followUsername);

  res.status(200).json(textify(user));
});

app.post('/users/:user/tweet', function(req, res, next) {
  var newTweet = new TweetWrapper(new Tweet(req.body));

  currentUser.timeline.unshift(newTweet);

  for (var i = 0, len = currentUser.followers.length; i < len; i++) {
    currentUser.followers[i].timeline.unshift(newTweet);
  }

  res.status(200).json(newTweet);
});

app.post('/users/:user/favorite', function(req, res, next) {
  var username = req.params.user;

  // TODO

  res.status(200).json({});
});

app.post('/users/:user/retweet', function(req, res, next) {

  var i = 0
  console.log(req.body);
  console.log(currentUser.timeline[0].tweetObject);
  for (i = 0; i < currentUser.timeline.length &&
    currentUser.timeline[i].tweetObject.id !== req.body; i++);

  var retweet = currentUser.timeline[i - 1];

  retweet.isRetweet = true;

  currentUser.timeline.unshift(newTweet);

  for (var i = 0, len = currentUser.followers.length; i < len; i++) {
    currentUser.followers[i].timeline.unshift(newTweet);
  }

  res.status(200).json({});
});


app.listen(3000);
