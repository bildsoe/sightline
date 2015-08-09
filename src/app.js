var express = require('express');
var app = express();
var pg = require('pg');

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var connectionString = 'postgres://postgres:1234@localhost:5432/aarhus';

var getForms = (req, res) => {

  var forms = [];
  var where = '';

  pg.connect(connectionString, (err, client, done) => {
  
    if(err) {
      return console.error('error fetching client from pool', err);
    }


    if(req.params.hasOwnProperty('id')){
      console.log("no")
      where = " where id=" + req.params.id;
    }

    // SQL Query > Select Data
    var query = client.query('SELECT * FROM reg1.form1' + where);

    // Stream results back one row at a time
    query.on('row', function(row) {
        forms.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        client.end();
        return res.json(forms);
    });

  });
  
};

console.log('logged into db');

//Set up static directory for serving static html


//API Routing
var apiRouter = express.Router();

apiRouter.use(function(req, res, next) {
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

apiRouter.route('/sightline')
  .get(function (req, res) {
    res.send("YES");
  });


app.use('/api', apiRouter);

var viewRouter = express.Router();

viewRouter.route('/')
  .get(function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });

//app.use('/', viewRouter);


//Start server
app.listen(3000);
console.log('Server startet on port 3000');



