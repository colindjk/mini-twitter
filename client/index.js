// When referring to something labeled *Object;
// refer to object as a text object where only
// it's tweets are in the form the server originally
// creates them in.
var currentUser = null;
var currentlyLoggedIn = null;

/**
 * Calls to the server for performing an action on a 
 * particular username, whether it's follow, unfollow,
 * or switchuser.
 * Optional 'action' for follow / tweet / unfollow etc.
 */
function serverCall(callback, username) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      console.log(JSON.parse(xhttp.responseText));
      callback(JSON.parse(xhttp.responseText));
    }
  };
  if(!username)
    username = "";
  else
    username = "/" + username;
  xhttp.open("get", "/users" + username);
  xhttp.send();
}

/**
 * Calls to the server for performing an action on a 
 * particular username, whether it's follow, unfollow,
 * or switchuser.
 * content which could be user, tweet info, tweet to be favorited etc.
 */
function serverPost(callback, content, action) {
  // Send request to server
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (xhttp.readyState === 4 && xhttp.status === 200) {
      console.log(JSON.parse(xhttp.responseText));
      callback(JSON.parse(xhttp.responseText));
    }
  };
  if (!action)
    action = "";
  else
    action = "/" + action;
  xhttp.open("post", "/users/" + currentlyLoggedIn.username + action);
  xhttp.send(content);
}

function createTweetElement(data) {
  var li = document.createElement('li');
  li.className = 'list-group-item tweet';

  var user = document.createElement('p');
  user.className = 'tweet-username';
  user.textContent = data.tweetObject.username;
  li.appendChild(user);

  var content = document.createElement('p');
  content.className = 'tweet-content';
  content.textContent = data.tweetObject.tweet;
  li.appendChild(content);

  var extras = document.createElement('div');
  extras.className = "row";

  var fave = document.createElement('div');
  var faveLink = document.createElement('a');
  faveLink.className = "favorite-link";
  faveLink.textContent = "Favorite";
  //faveLink.onclick = function() {}
  var faveCount = document.createElement('span');
  faveCount.className = "favorite-count";
  faveCount.textContent = data.tweetObject.favorites;
  fave.appendChild(faveLink);
  fave.appendChild(faveCount);

  var retweet = document.createElement('div');
  var retweetLink = document.createElement('a');
  retweetLink.className = "retweet-link";
  retweetLink.textContent = "Retweet";

  retweetLink.onclick = function () {
    serverPost(function(tweetObject) {
      if(tweetObject) {
        var element = createTweetElement(tweetObject);
        tweetList.insertBefore(element, tweetList.childNodes[0]);
      }
    }, data.tweetObject.id, "retweet");
  };

  var retweetInd = document.createElement('span');
  retweetInd.className = "retweet-indicator";
  retweetInd.textContent = "-> This is a retweet!!";

  retweet.appendChild(retweetLink);
  if(data.isRetweet)
    retweet.appendChild(retweetInd);

  extras.appendChild(fave);
  extras.appendChild(retweet);
  li.appendChild(extras);

  return li;
}

function createTweetElements(data) {
  return data.map(createTweetElement);
}

function createUserLink(user) {
  var li = document.createElement('li');
  var a = document.createElement('a');
  a.textContent = user.username;
  a.href = '#';
  li.appendChild(a);
  return li;
}

function createUserLinks(users) {
  return users.map(createUserLink);
}

function clearInput(input) {
  input.value = '';
}

function replaceAllChildren(element, newChildren) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
  newChildren.forEach(function(newChild) {
    element.appendChild(newChild);
  });
}

function isLink(element) {
  return element.nodeName === 'A';
}

// All 'user' objects will be the text versions of said objects.
window.addEventListener('load', function() {

  var logInInput = document.getElementById('switch-user-input');
  var logInButton = document.getElementById('switch-user-button');
  var tweetInput = document.getElementById('tweet-input');
  var tweetButton = document.getElementById('tweet-button');
  var followInput = document.getElementById('follow-input');
  var followButton = document.getElementById('follow-button');
  var tweetList = document.getElementById('tweet-list');
  var followerList = document.getElementById('follower-list');
  var followingList = document.getElementById('following-list');
  var currentUserHeader = document.getElementById('current-user-header');

  function switchUserLink(e) {
    if(isLink(e.target)) {
      serverCall(switchUser, e.target.textContent);
    }
  }

  function switchUserForm(e) {
    serverPost(switchUser, logInInput.value, "login");
    clearInput(switchUserInput);
  }

  function switchUser(user) {

    currentUser = user;

    currentUserHeader.textContent = currentlyLoggedIn.username; // not current user!

    replaceAllChildren(
      tweetList,
      createTweetElements(currentUser.timeline));

    var friendsList = [];
    for (var friend in currentlyLoggedIn.friends) {
      friendsList.unshift({ username: friend });
    }
    replaceAllChildren(
      friendsList,
      createUserLinks(friendsList)); // .following?
  }

  function tweet(tweetObject) {
    //var content = tweetInput.value;

    if(tweetObject) {
      var element = createTweetElement(tweetObject);
      tweetList.insertBefore(element, tweetList.childNodes[0]);

      clearInput(tweetInput);
    }
  }
  function callTweet() {
    serverPost(tweet, tweetInput.value, "tweet");
  }

  function follow(user) {
    var link = createUserLink(user);
    followingList.appendChild(link);

    clearInput(followInput);
  }
  function callFollow(username) {
    serverPost(follow, followInput.value, "follow");
  }

  followingList.addEventListener('click', switchUserLink);
  followerList.addEventListener('click', switchUserLink);
  logInButton.addEventListener('click', switchUserForm);
  tweetButton.addEventListener('click', callTweet);
  followButton.addEventListener('click', callFollow);

  serverCall(switchUser);
});
