var pg = require('pg');
var multiline = require('multiline');
var _ = require('lodash');

var connectionString = 'postgres://postgres:1234@localhost:5432/aarhus';

var get3Dline = (req, res) => {

  var forms = [];

  pg.connect(connectionString, (err, client, done) => {
  
    if (err) {
      return console.error('error fetching client from pool', err);
    }

    var str1 = multiline(() => {/*
    WITH line AS
        -- From an arbitrary line
        (SELECT 'SRID=25832;
    */});    
    
    var str2 = multiline(() => {/*    
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
    query.on('row', (row) => {
        forms.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
        client.end();
        return res.json(forms);
    });
  });
};

var getNode = () => {
  //TODO return node ID from point - to be used in the calculation of route
}

var getRoute = (req, res) => {
  
  var forms = [],
      pt1 = req.body.data[0].reduce((a, b) => {return a.toString() + "," + b.toString()}),
      pt2 = req.body.data[1].reduce((a, b) => {return a.toString() + "," + b.toString()});
  
  
  var pairedPts = [];
  
  req.body.data.forEach( function (entry, index) {
    if(index < req.body.data.length - 1){
      pairedPts.push([req.body.data[index],req.body.data[index + 1]]);
    }
  })
  
  console.log(pairedPts);
  
  pg.connect(connectionString, (err, client, done) => {
  
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    
    /*
    var roads = "public.roads";
    var vertices = "roads_vertices_pgr";
    */
    
    var roads = "public.vejman_aarhus";
    var vertices = "vejman_aarhus_vertices_pgr";
    
    
    
    
    
    var str1 = "SELECT seq, id1 AS node, id2 AS edge, cost, ST_AsText(wkb_geometry) FROM pgr_dijkstra('SELECT ogc_fid as id, source, target, st_length(wkb_geometry) as cost FROM " + roads + "',(SELECT id::integer FROM " + vertices + " ORDER BY the_geom <-> ( SELECT ST_SetSRID(ST_Point(" + pt1 + "),25832) limit 1)  LIMIT 1), (SELECT id::integer FROM " + vertices + " ORDER BY the_geom <-> ( SELECT ST_SetSRID(ST_Point(" + pt2 + "),25832) limit 1)  LIMIT 1), false, false) as di JOIN " + roads + " pt ON di.id2 = pt.ogc_fid ;";

    // SQL Query > Select Data
    var query = client.query(str1);

    // Stream results back one row at a time
    query.on('row', (row) => {
        forms.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', () => {
        client.end();
        return res.json(forms);
    });

  });
};

module.exports = {
  "get3Dline": get3Dline,
  "getRoute": getRoute
};
