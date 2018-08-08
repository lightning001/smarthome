var	config = require('../util/config'),
    room = require('../model/room'),
    mode = require('../model/mode'),
    device = require('../model/device'),
    deviceinroom = require('../model/device_in_room'),
    user = require('../model/user');
module.exports = exports = {
    search : async (keywords, callback)=>{
        let result = [];
        let error = false;
        await room.find({$text : {$search: keywords}}).sort({id_user: 1, room_name: 1}).exec((err, data)=>{
            if(err){
                error = true;
            }else if(data.length > 0){
                result.push({key : 'Room', value : data})
            }
        });
        await mode.find({$text : {$search: keywords}}).sort({id_user: 1, mode_name: 1}).exec((err, data)=>{
            if(err){
                error = true;
            }else if(data.length > 0){
                result.push({key : 'Mode', value : data})
            }
        });
        await device.find({$text : {$search: keywords}}).sort({name: 1, type: 1, price : 1}).exec((err, data)=>{
            if(err){
                error = true;
            }else if(data.length > 0){
                result.push({key : 'Device', value : data})
            }
        });
        await deviceinroom.find({$text : {$search: keywords}}).sort({user: 1, device_name: 1, room : 1}).exec((err, data)=>{
            if(err){
                error = true;
            }else if(data.length > 0){
                result.push({key : 'Device User', value : data})
            }
        });
        await user.find({$text : {$search: keywords}},{password : 0}).or([{admin : false}, {admin : {$exists : false}}]).select('name img _id city district email').sort({name: 1, email: 1}).exec((err, data)=>{
            if(err){
                error = true;
            }else if(data.length > 0){
                result.push({key : 'User', value : data})
            }
        });
        await user.find({$text : {$search: keywords}}, {password : 0}).where('admin', true).exec((err, data)=>{
            if(err){
                error = true;
            }else if(data.length > 0){
                result.push({key : 'Admin', value : data})
            }
            if(error){
                return callback(new Error(), null);
            }else{
                callback(null, result);
            }
        });
    },
    user_search : async (user, keywords, callback)=>{
       let result = [];
       let error = false;
       await room.find({$text : {$search: keywords}, 'id_user' : user}).sort({room_name: 1}).exec((err, data)=>{
           if(err){
               console.log(err);
               error = true;
           }else if(data.length > 0){
               result.push({key : 'Room', value : data})
           }
       });
       await mode.find({$text : {$search: keywords}, 'id_user' : user}).sort({mode_name: 1}).exec((err, data)=>{
           if(err){
               console.log(err);
               error = true;
           }else if(data.length > 0){
               result.push({key : 'Mode', value : data})
           }
       });
       await deviceinroom.find({$text : {$search: keywords}, 'user' : user}).sort({room : 1,device_name: 1}).exec((err, data)=>{
           if(err){
               console.log(err);
               error = true;
           }else if(data.length > 0){
               result.push({key : 'Device User', value : data})
           }
           if(error){
               return callback(new Error(), null);
           }else{
               callback(null, result);
           }
       });
    }
}
