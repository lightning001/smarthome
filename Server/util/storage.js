const storage = require('node-persist'),
	EmailManagement = require('./Email'),
	Template = require('../control/emailtemplate'),
	randomstring = require('randomstring'),
	msg = require('../msg').en,
	User = require('../control/user'),
	base64url = require('base64url'),
	jwt = require('jsonwebtoken'),
	config = require('./config'),

	recover_password_options = {dir : 'storage/recover_password',	ttl : 1000*60*5,	encoding: 'utf8',	forgiveParseErrors: false},
	active_account = {dir : 'storage/active_account',	ttl : 1000*60*30,	encoding: 'utf8',	forgiveParseErrors: false};

var pw_Storage = storage.create(recover_password_options),
	active_Storage = storage.create(recover_password_options),
	StorageManagement = new Object();
	pw_Storage.init();
	active_Storage.init();

StorageManagement.initStorage = function(){
	return new Promise(async(resolve, reject)=>{
		await	pw_Storage.init();
		await	active_Storage.init();
		resolve(true);
	})
}

StorageManagement.clearStorage = function(){
	return new Promise(async (resolve, reject)=>{
		await pw_Storage.clear();
		await active_Storage.clear();
		resolve(true);
	});
}

StorageManagement.requestRecoverPassword = function(email, name){
	return new Promise(async (resolve, reject)=>{
		let number = randomstring.generate({length : 6, charset : 'numeric'});
		let encode = base64url.encode(jwt.sign(JSON.stringify({'email': email}), config.secret_key, {algorithm : 'HS256'}));
		let link = config.host + '/recover/password/'+ encode;
		await pw_Storage.setItem(email, number);
		console.log('..ahihi.. '+await pw_Storage.getItem('ahihi'));
		console.log(await pw_Storage.getItem(email));
		Template.RecoverPassword(email, name, link, number).then(()=>{resolve(true)}).catch(e=>{reject(e);});
	})
}

StorageManagement.checkRecoverPassword = function(email, key){
	return new Promise(async (resolve, reject)=>{
		let sys_key = await pw_Storage.getItem(email);
		if(sys_key==undefined){
			reject({success : false, message : msg.error.timeout});
		}else{
			if(sys_key == key){
				await storage.removeItem(email);
				resolve({success : true});
			}else{
				reject({success : false, message : msg.error.forgetcode});
			}
		}

	})
}

StorageManagement.activeAccount = (email, name)=>{
	return new Promise((resolve, reject)=>{
		User.findByEmail(email).then(async data=>{
			let token = jwt.sign({'email': data.result.email, 'name' : data.result.name, '_id' : data.result._id}, config.secret_key, {algorithm: 'HS256'});
			let encode = base64url.encode(token.toString(), 'binary');
			await active_Storage.setItem(email, encode, {ttl: 1000*60*30});
			let link = config.host + 'activeaccount/'+encode;
			Template.ActiveAccount(email, name, link).then(()=> resolve(true)).catch(e=>{resolve(false);});
		}).catch(e=>{
			console.log(e);
			reject(e);
		});
	});
}

StorageManagement.checkActiveAccount = (encode)=>{
	return new Promise((resolve, reject)=>{
		let token = base64url.decode(encode, 'binary');
		jwt.verify(token, config.secret_key, async (err, data)=>{
			if(err){
				reject({success: false, message: msg.error.occur});
			}else{
				let sys_encode = await active_Storage.getItem(data.email);
				if(!sys_encode){
					reject({success : false, message : msg.error.timeout});
				}else if(sys_encode != encode){
					reject({success : false, message : msg.error.occur});
				}else if(sys_encode == encode){
					User.activeAccount(data.result.email).then(result=>{
						Template.Thankyou(data.result.email, data.result.name).then(()=>resolve(true)).catch(e=>reject(e));
					}).catch(e=>{
						reject({success : false, message : e.message});
					});
				}
			}
		});
	});
}

module.exports = exports = StorageManagement;
