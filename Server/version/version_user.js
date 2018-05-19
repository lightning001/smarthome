'use strict'

var mongoose = require('mongoose');
var conn = require('../util/config').database_version;

var schemaVersionUser = new mongoose.Schema({
  user_id : {type : mongoose.Schema.Types.ObjectId},
  email : {type : String, required: true},
  password : {type : String, required: true},
  name : {type : String},
  street : {type : String},
  district : {type : String},
  city : {type : String},
  postcode : {type : Number},
  phonenumber : {type : String},
  homephone : {type : String},
  dob : {type : Date},
  type : {type : String},
  status : {type : Boolean},
  startdateregister : {type : Date},
  img : {type : String},
  version : {type: Number}
});

var VersionUser = conn.model('VersionUser', schemaVersionUser, 'VERSIONUSER');

VersionUser.countvsUser = (user_id)=>{
  return new Promise((resolve, reject)=>{
    VersionUser.count({'user_id' : new mongoose.Types.ObjectId(user_id)}, (err, count)=>{
      if(err) {
        console.log(err);
        reject(1);
      } else {
        resolve(count);
      }
    });
  });
}

VersionUser.mInsert = async (data) =>{
  let mUser = new VersionUser();
  mUser.user_id = data.user_id;
  mUser.email = data.email;
  mUser.password = data.password;
  mUser.name = data.name;
  mUser.street = data.street;
  mUser.district = data.district;
  mUser.city = data.city;
  mUser.postcode = data.postcode;
  mUser.phonenumber = data.phonenumber;
  mUser.homephone = data.homephone;
  mUser.dob = data.dob;
  mUser.type = data.type;
  mUser.status = data.status;
  mUser.startdateregister = data.startdateregister;
  mUser.img = data.img;
  var version = 1;
  try {
    version = await VersionUser.countvsUser(data.user_id);
  }catch(err){
    console.log(err);
  }
  mUser.version = version + 1;
  mUser.save((err)=>{
    if(err){
      console.log(err);
    } else {
      console.log(true);
    }
  });
}

VersionUser.sumUser = (token, socket) =>{

}

module.exports = exports = VersionUser;
