var mDevice = require("./Device.js");
// var dv = new Device(4, "Quạt", "fan.png", "quat dien", "200000.0", 1);
mDevice.findByID(1);

User.getRoom_Mode_User = (userID)=>{
  return new Promise((resolve, reject) =>{
    let u = User.aggregate([
      {
        $lookup:{
          from : 'MODE',
          localField : '_id',
          foreignField: "id_user",
          pipeline : {'_id' : new mongoose.Type.ObjectId(userID)},
          as: "mode_info"
        }
      },{
        $lookup:{
          from : 'ROOM',
          localField : '_id',
          foreignField: "id_user",
          as: "room_info"
        }
      },{
        $match:{
            "listMode" : { $ne: [] },
            'listRoom' : { $ne: [] }

        }
      }
    ]);
    return resolve(u.toString());
  });
}
