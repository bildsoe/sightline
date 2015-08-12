var express = require('express');
var app = express();
var pg = require('pg');
var multiline = require('multiline');

var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var connectionString = 'postgres://postgres:1234@localhost:5432/aarhus';

var get3Dline = (req, res) => {

  var forms = [];
  var where = '';

  pg.connect(connectionString, (err, client, done) => {
  
    if(err) {
      return console.error('error fetching client from pool', err);
    }

var str1 = multiline(function(){/*
WITH line AS
    -- From an arbitrary line
    (SELECT 'SRID=25832;
*/});    
    
var str2 = multiline(function(){/*    
    '::geometry AS geom),
  linemesure AS
    -- Add a mesure dimension to extract steps
    (SELECT ST_AddMeasure(line.geom, 0, ST_Length(line.geom)) as linem,
            generate_series(0, ST_Length(line.geom)::int, 10) as i
     FROM line),
  points2d AS
    (SELECT ST_GeometryN(ST_LocateAlong(linem, i), 1) AS geom FROM linemesure),
  cells AS
    -- Get DEM elevation for each
    (SELECT p.geom AS geom, ST_Value(mnt.rast, 1, p.geom) AS val
     FROM mnt, points2d p
     WHERE ST_Intersects(mnt.rast, p.geom)),
    -- Instantiate 3D points
  points3d AS
    (SELECT ST_SetSRID(ST_MakePoint(ST_X(geom), ST_Y(geom), val), 25832) AS geom FROM cells)
-- Build 3D line from 3D points
SELECT val,ST_X(geom) as ptX,ST_Y(geom) as ptY FROM cells
*/});

    // SQL Query > Select Data
    var query = client.query(str1 + req.body.data + str2);

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

apiRouter.use((req, res, next) => {
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});

apiRouter.route('/sightline')
  .post(get3Dline);

app.use('/api', apiRouter);



//Start server
app.listen(3000);
console.log('Server startet on port 3000');



