var jwt = require('jsonwebtoken');
const config = require('../util/config');
const msg = require('../msg').en;

var verify = (token)=>{
	return new Promise((resolve, reject)=>{
		jwt.verify(token, config.secret_key, (err, decode)=>{
			if(err)
				return reject( msg.error.occur);
			else if(decode){
				return resolve(decode);
			}
		});
	});
}

module.exports = exports = verify;