var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');
app.set('port',(process.env.PORT || 3001));
//定义根路径
app.use('/', express.static(path.join(__dirname, 'public')))
// parse application/json 
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/comments', function(req,res){
  fs.readFile(COMMENTS_FILE, function(err, data){
    if( err ){
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data)
    res.json(comments)
  })
})

app.post('/api/comments', function(req,res){
  fs.readFile(COMMENTS_FILE, function( err, data){
    if( err ){
      console.error(err)
      process.exit(1);
    }
    var comments = JSON.parse(data)

    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text
    }

    comments.push(newComment)

    fs.writeFile(COMMENTS_FILE,JSON.stringify(comments),function( err ){
      if(err){
        console.error(err)
        process.exit(1)
      }
      res.json(comments)
    })
  })
})

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port')+ '/')
})