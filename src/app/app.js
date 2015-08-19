var express = require('express');
var app = express();
var db = require('./db');

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());






console.log('logged into db from client');

//Set up static directory for serving static html


//API Routing
var apiRouter = express.Router();

apiRouter.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

apiRouter.route('/sightline')
  .post(db.get3Dline);

apiRouter.route('/getRoute')
  .post(db.getRoute);


app.use('/api', apiRouter);



//Start server
app.listen(3000);
console.log('Server startet on port 3000');



