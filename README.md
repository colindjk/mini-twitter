# CS2304 Spring 2016 - Project 4 (DUE 5/10/16)

In this project we will bring together everything in [project 1](https://github.com/VTCS2304/project1), [project 2](https://github.com/VTCS2304/project2), and [project 3](https://github.com/VTCS2304/project3). This project adds one final component, a web server, to the Twitter implementation. Adding a web server allows the state information (timelines, following information, etc) to persist across numerous browser sessions. The server should store state information in memory.

## Project Requirements

You must persist all state information on the server side. This includes a user's timeline, following, and follower information. This will also require the addition of favorites and retweets. The logic of this project mirrors exactly the logic from project 2.

### Timeline, Followers, and Following; Switch User; Tweet; Follow

See [project 3](https://github.com/VTCS2304/project3) for detailed information on these actions. The only difference between project 3 and this project is the browser will be refreshed to ensure the data is persisted to the server during tests.

### Favorite

Favoriting allows users to favorite tweets, incrementing the favorite count. Two pieces of information must be added to each tweet element, the favorite link and the favorite count. Clicking on the favorite link will increment the favorite count following the same business logic as project 2.

**Required CSS Selectors**

|Selector|Node|Example|
|--------|----|-------|
|`#tweet-list .tweet .favorite-link`|The favorite link on each tweet element that will increment the favorite count when clicked.|`<a href="#" class="favorite-link">Favorite</a>`|
|`#tweet-list .tweet .favorite-count`|The favorite count on each tweet element that contains the numeric value of the number of favorites for that specific tweet.|`<span class="favorite-count">5</span>`|

### Retweet

Retweeting allows one user to share another users tweets with their followers. Each tweet element will have a retweet link that performs a retweet. When a user is viewing a retweet, an additional element is shown indicating that they are viewing a retweet. Remember, the original tweeter and the retweeter will not see this indicator, just users that have the tweet on their timeline because of a retweet.

**Required CSS Selectors**

|Selector|Node|Example|
|--------|----|-------|
|`#tweet-list .tweet .retweet-link`|The retweet link on each tweet element that will retweet the tweet with clicked.|`<a href="#" class="retweet-link">Retweet</a>`|
|`#tweet-list .tweet .retweet-indicator`|The retweet indicator that is only present on retweets (not original tweet). Anything you want can be in the element.|`<span class="retweet-indicator">(again)</span>`|

### Example Tweet Elements

**Normal Tweet**

```
<li class="list-group-item tweet">
  <p class="tweet-username">brian</p>
  <p class="tweet-content">hello world</p>
  <div class="row">
    <div class="col-md-2"><a href="#" class="favorite-link">Favorite</a> <span class="favorite-count">5</span></div>
    <div class="col-md-3"><a href="#" class="retweet-link">Retweet</a></div>
  </div>
</li>
```

**Retweet**

```
<li class="list-group-item tweet">
  <p class="tweet-username">brian</p>
  <p class="tweet-content">hello world</p>
  <div class="row">
    <div class="col-md-2"><a href="#" class="favorite-link">Favorite</a> <span class="favorite-count">5</span></div>
    <div class="col-md-3"><a href="#" class="retweet-link">Retweet</a> <span class="retweet-indicator">(again)<span></div>
  </div>
</li>
```

## Quick Lessons

There are a few key pieces to this project. Here is some additional, helpful lessons on those pieces.

### XMLHttpRequest

[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)'s must be used to persist information. In project 3, the browser stored all state information however the server side should maintain most state information now. XMLHttpRequest's are used to pass data back and forth between the browser and the server.

### Express

[Express](http://expressjs.com) is a common web server used in Node. It uses middleware to handle requests and deliver responses to the browser. As with all things node and JavaScript, it is async. 

Here is a brief overview of how express can be configured to handle web requests relevant to this project.

```javascript
// Respond to a GET to /url with a 200 (success) signal and no data.
app.get('/url', function(req, res, next) {
  res.sendStatus(200);
});

// Respond to a GET to /url with a 200 (success) signal and JSON
// data.
app.get('/url', function(req, res, next) {
  res
    .send(200)
    .json({
      username: 'brian'
    });
});

// Responding to a GET with a variable URL like /users/<username>.
app.get('/users/:user', function(req, res, next) {
  var user = req.params.user;
  res
    .send(200)
    .json({
      username: user
    });
});

// Responding to a GET with a query parameter like /url?user=brian
app.get('/url', function(req, res, next) {
  var user = req.query.user;
  res
    .send(200)
    .json({
      username: user
    });
});

// Handling text data in the body of a POST request. Remember, everything
// will be a string so any numbers passed will need to be converted to a
// number with parseInt()
app.post('/url',
  function(req, res, next) {
    var textData = req.body;
    res.sendStatus(200);
  });

// Handling JSON data in the body of a POST request.
app.post('/url',
  bodyParser.json(),
  function(req, res, next) {
    var jsonData = req.body;
    res.sendStatus(200);
  });
```

The code in [`server/index.js`](server/index.js) is stubbed out with one possible (albeit incomplete) implementation of the web request handlers. Feel free to use this implementation or modify it to your choosing.

### JSON Serialization

It's very easy to turn an object into JSON and vice versa:
- `JSON.parse(string)` - String to deserialize into an object.
- `JSON.stringify(object)` - Object to serialize into a string.

Some of you may experience a problem with serialization. Circular references (user object Bob references user object Mary and vice versa) can't be serialized. If this happens to you, remember the browser doesn't need the entire data model. The browser just needs the raw information necessary to render. For example, to view a single user, the browser only needs:

- The username of the user being viewed
- Array of strings representing following usernames
- Array of strings representing follower usernames
- Array of tweet objects with a string content, string username, integer favorite, and boolean retweet property.

### Project 3 Lessons

See [project 3](https://github.com/VTCS2304/project3) for more quick lessons.

## Grading Rubric
The following grading rubric will be used to grade the assignment.

|Functionality|Percentage of Grade|Notes|
|-------|-------------------|-----|
|Tests|70%|All the automated tests to validate behavior|
|4 pieces of flair|20%|See below|
|[Style guidelines](STYLE.md) are followed|10%|Half a point will be deducted for each violation.|

### Flair

Even more new concepts are added to this project. Take some time to experiment and add additional capabilities to the project. The same flair from project 3 can be used, but doesn't have to be used, for project 4.

* Return server side errors if disallowed actions are performed.
* Persist data to disk.
* Style the page to make it look way better.
* Implement reweeting, favoriting, or unfollowing.
* Use [`window.localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to persist tweet information between page reloads.
* Add [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) when changing the DOM.
* Use [`window.history`](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to manipulate the URL.
* Add validation to input elements (i.e. not empty, less than 140 characters) 

Flair can be almost anything. Flair should be documented in [`FLAIR.md`](FLAIR.md) and **each piece of flair must be at least 10 lines code**. Flair is what you make it. Ten lines of code is almost nothing and can be dded with almost no effort, but taking the time to learn something new is invaluable and will make you a better software developer.

<iframe src="https://player.vimeo.com/video/102830089" width="500" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

## Getting Started

This project has the most moving pieces. It requires the server to be run in node, and then the project to be viewed in the browser.

1. Create a fork of the [project](https://github.com/VTCS2304/project4) in your personal Github account. ![2016-01-10_12-16-05](https://cloud.githubusercontent.com/assets/309711/12222786/6576776a-b794-11e5-869b-ea76c2e86d13.png)
1. Open a terminal to the directory of your choice and run the following commands:

  ```bash
  git clone git@github.com:<insert your Github username here>/project4.git
  cd project4
  npm install
  ```

## Coding

Most of your coding will take place in the following files:

* [`client/index.html`](client/index.html) - The HTML page loaded in the browser.
* [`client/index.js`](client/index.js) - Client side JavaScript.
* [`server/index.js`](server/index.js) - Server side JavaScript.

Please avoid coding JavaScript directly in `index.html`. That's typically considered a bad practice as the code isn't unit testable.

Anything in the [Javascript Standard Library](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference) and [Web APIs]() are fair game to use to complete the assignment. **Node.js libraries and other open source libraries are fair game for this project!** Feel free to use any library you so choose as long as it is open source and not plagerizing other students work.

## Running the Application

1. Run the web server

  ```bash
  npm start
  ```
1. Navigate to `http://localhost:3000/index.html` in your browser.

## Tests

Tests execute in a browser for this assignment using [Selenium](http://www.seleniumhq.org). To run tests, just type `npm test` and Firefox will execute your tests. Note that the web server must be running.

[Style](STYLE.md) rules can be checked with [ESLint](http://eslint.org). Just run `npm run lint` to see a list of style violations.

**Note - Tests may become fragile after numerous tests runs due to naming conflicts. Restart the web server every now and again to prevent.**

## Submitting your assignment

Project will be submitted to your forks on Github via git. Simple run the following commands from the root of the project directory.

```
git add .
git commit -m "<Insert some commit message describing your changes>"
git push origin master
```
If you are comfortable with git, feel free to [commit](https://git-scm.com/docs/git-commit) frequently, use [branches](https://git-scm.com/docs/git-branch), and whatever else is helpful in successfully completing the project. Remember, versioning and backing up your code is **your responsibility**.

Note that `git add .` will add all files in the project directory to the submission. To selectively add files, just call `git add <filename>` for each file you wish to submit.

## Honor Code

This is an **individual project** and should not be done in a group. Do not plagiarize other students or online code to complete the assignment.

In addition to the normal honor code rules, the following additional rules are in effect for your usage of Github.

* Do not add collaborators to your Github fork. This is audited in Github and will be visible to the instructor.
* Do not open pull requests for your work back into the main repository. This will allow all other students to see your work.
* Do not attempt to use localStorage to avoid server side coding.

## Tips

My recommended approach to this project is to have browser actions trigger XMLHttpRequest's. Those XMLHttpRequests are handled by the express web server, which calls the application code from project 2 to perform the action. After this XMLHttpRequest is complete, the browser requests the timeline, followers, and following via another XMLHttpRequest. The browser in this scenario has rendering logic and the server has the twitter application logic.

Serialization of data from the client to the server and orchestration of async XMLHttpRequests are the big challenge for this project.
