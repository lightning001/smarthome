const MongoClient = require('mongodb').MongoClient;
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'SmartHome';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, database) {
  if(err){
    console.log("Connection Error: "+err);
  }else{
    console.log("Connected successfully to server");
    const db = database.db(dbName);
    find_DeviceByID(db, 1);
    database.close();
  }
});

const find_DeviceByID = function(db, deviceID) {
  // Get the documents collection
  const collection = db.collection('DEVICE');
  collection.find({id : deviceID}).toArray(function(err, data){
    if(err){
      console.log("Err: "+err);
    }else{
    console.log("Data: "+ JSON.stringify(data));
    return data;
    }
  });
}

const find_DeviceByName = function(db, deviceName, callback) {
  var key = deviceName.toLowerCase();
  // Get the documents collection
  const collection = db.collection('DEVICE');
  collection.find({name : /key/}).toArray(function(err, doc){
    if(err){
      console.log("Err: "+err);
    }else{
    console.log("Doc: "+doc);
    }
  });
}
