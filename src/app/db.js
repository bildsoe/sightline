var pg = require('pg');
var multiline = require('multiline');

var connectionString = 'postgres://postgres:1234@localhost:5432/aarhus';

var get3Dline = (req, res) => {

  var forms = [];

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

var getNode = () => {
  //TODO return node ID from point - to be used in the calculation of route
}

var getRoute = (req, res) => {

  var forms = [];

  pg.connect(connectionString, (err, client, done) => {
  
    if(err) {
      return console.error('error fetching client from pool', err);
    }

    var str1 = "SELECT seq, id1 AS node, id2 AS edge, cost, wkb_geometry FROM pgr_dijkstra('SELECT ogc_fid as id, source, target, st_length(wkb_geometry) as cost FROM public.roads',(SELECT id::integer FROM roads_vertices_pgr ORDER BY the_geom <-> ( SELECT ST_Transform(ST_SetSRID(ST_Point(1135423.917,7595561.637),900913),25832) limit 1)  LIMIT 1), (SELECT id::integer FROM roads_vertices_pgr ORDER BY the_geom <-> ( SELECT ST_Transform(ST_SetSRID(ST_Point(1133590.701,7583942.080),900913),25832) limit 1)  LIMIT 1), false, false) as di JOIN public.roads pt ON di.id2 = pt.ogc_fid ;";

    // SQL Query > Select Data
    var query = client.query(str1);

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

module.exports = {"get3Dline":get3Dline,"getRoute":getRoute};
