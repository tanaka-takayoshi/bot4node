var port = (process.env.VMC_APP_PORT || process.env.C9_PORT || 3000);
var host = (process.env.VCAP_APP_HOST || '0.0.0.0');
var http = require('http');

if(process.env.VCAP_SERVICES){
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var mongo = env['mongodb-1.8'][0]['credentials'];
}
else{
  var mongo = {
    "hostname":"localhost",
    "port":27017,
    "username":"",
    "password":"",
    "name":"",
    "db":"db"
  };
}

var generate_mongo_url = function(obj){
  obj.hostname = (obj.hostname || 'localhost');
  obj.port = (obj.port || 27017);
  obj.db = (obj.db || 'test');

  if(obj.username && obj.password){
    return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
  else{
    return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
  }
};

var mongourl = generate_mongo_url(mongo);

var record_visit = function(req, res){
  /* Connect to the DB and auth */
  require('mongodb').connect(mongourl, function(err, conn){
    conn.collection('tweets', function(err, coll){
      /* Simple object to insert: ip address and date */
      var object_to_insert = { 'tweet': 'Test message from' + req.connection.remoteAddress, 'ts': new Date() };

      /* Insert the object then print in response */
      /* Note the _id has been created */
      coll.insert( object_to_insert, {safe:true}, function(err){
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(JSON.stringify(object_to_insert));
        res.end('\n');
      });
    });
  });
};

var print_visits = function(req, res){
  /* Connect to the DB and auth */
  require('mongodb').connect(mongourl, function(err, conn){
      conn.collection('tweets', function(err, coll){
          coll.find({}, {limit:10, sort:[['_id','desc']]}, function(err, cursor){
              cursor.toArray(function(err, items){
                  res.writeHead(200, {'Content-Type': 'text/plain'});
                  for(var i=0; i<items.length;i++){
                      res.write(JSON.stringify(items[i]) + "\n");
                  }
                  res.end();
              });
          });
      });
  });
};

var delete_tweets = function (req, res) {
  require('mongodb').connect(mongourl, function(err, conn){
      conn.collection('tweets', function(err, coll){
          coll.find({}, {limit:10, sort:[['_id','desc']]}, function(err, cursor){
              cursor.toArray(function(err, items){
                  res.writeHead(200, {'Content-Type': 'text/plain'});
                  for(var i=0; i<items.length;i++){
                      res.write(JSON.stringify(items[i]) + "\n");
                  }
                  res.end();
              });
          });
      });
  });
}

http.createServer(function (req, res) {
  var params = require('url').parse(req.url);
  switch (params.pathname) {
    case '/list', '/':
      print_visits(req, res);
      break;
    case '/tweet':
      record_visit(req, res);
      break;
    case '/delete':
      delete_tweets(req, res);
      break;
    default:
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.write('NOT FOUND');
      res.end();
  }
}).listen(port, host);

console.log("Server starts listening at " + port);