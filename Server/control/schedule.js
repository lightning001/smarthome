var schedule = require('node-schedule'),
	task_schedule = require('node-task-scheduler'),
	Mode = require('./mode'),
	myTask = new Object(),
	rule = new schedule.RecurrenceRule();

rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
rule.hour = 23;
rule.minute = 55;

var Scheduler = {};
var Task = task_schedule.init({tasksDir: './tasks'});
schedule.scheduleJob('55 23 * * *', ()=>{
	console.log('daily schedule');
	Scheduler.initScheduler();
});
Scheduler.initScheduler = async (io)=>{
	let date = new Date(new Date().getTime() + 36000);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	//addTask(name, args, activity, frequency, endDate)
	Mode.getAllModeON().then(listMode=>{
		listMode.result.forEach(mode=>{
			let	hh = mode.starttime/3600;
			let mm = mode.starttime%3600/60;
			let circle = '';
			if(mode.circle.length==0){
				
			}else if(mode.circle.length==1){
				circle = mode.circle[0];
			}else{
				let s = JSON.stringify(mode.circle);
				circle= s.substring(1, s.length-1);

			}
			if(circle!=''){
				mode.modedetail.forEach(modedetail=>{
					let frequency;
					let periousTime = modedetail.schedule.ontime + modedetail.schedule.offtime;
					let	perhh = periousTime/3600;
					let permm = periousTime%3600/60;
					let stoptime = date;
					stoptime.setHours(hh);
					stoptime.setMinutes(mm);
					if(modedetail.schedule.offtime ==0){
						frequency = '0 ' + mm + ' ' + hh + ' * * '+circle;
						Task.addTask(''+modedetail._id, {'modedetail' : modedetail}, (data, callback)=>{
							io.of('/'+data.data.modedetail.device.room).emit('control-board', 'true'+data.data.modedetail.device._id);
						}, frequency, stoptime);
					}else{
						let frequencyOn = '0 '+ mm+'/'+permm+' '+hh+'/'+perhh+' * * '+circle;

						Task.addTask(''+modedetail._id, {'modedetail' : modedetail}, (data, callback)=>{
							io.of('/'+data.modedetail.device.room).emit('control-board', 'true'+data.modedetail.device._id);
							console.log('on task');
						}, frequencyOn, stoptime);

						let frequencyOff = '0 '+ (mm+modedetail.schedule.ontime/3600)+'/'+permm+' '+(hhmm+modedetail.schedule.ontime%3600/60)+'/'+perhh+' * * '+circle;

						Task.addTask(''+modedetail._id, {'modedetail' : modedetail}, (data, callback)=>{
							console.log('add task off');
							io.of('/'+data.modedetail.device.room).emit('control-board', 'true'+data.modedetail.device._id);
						}, frequencyOff, stoptime);
					}

				});
			}
		});
	}).catch(e=>{
		console.log(e);
	})
}


Scheduler.addTask = (id_mode, user,io)=>{
	Mode.getFullDetail(user, id_mode).then(mode=>{
		let	hh = mode.starttime/3600;
		let mm = mode.starttime%3600/60;
		let circle = '';
		if(mode.circle().length==0)
			{
				return;
			}
		else if(mode.circle.length==1){
			circle = mode.circle[0];
		}else{
			let s = JSON.stringify(mode.circle());
			circle= s.substring(1, s.length-1);
		}
		data.modedetail.forEach(modedetail=>{
			let activity;
			let periousTime = data.modedetail.schedule.ontime + data.modedetail.schedule.offtime;
			let	perhh = periousTime/3600;
			let permm = periousTime%3600/60;
			if(data.modedetail.schedule.offtime ==0){
				activity = '0 ' + mm + ' ' + hh + ' * * '+circle;
				Task.addTask(''+data.modedetail._id, {'modedetail' : modedetail}, (data, callback)=>{
					io.of('/'+data.modedetail.device.room).emit('control-board', 'true'+data.modedetail.device._id);
				}, activity, new Date(date.getTime()+86400*365*10));
			}else{
				let stoptime = date;
				stoptime.setHours(hh);
				stoptime.setMinutes(mm);
				let activityOn = '0 '+ mm+'/'+permm+' '+hh+'/'+perhh+' * * '+circle;

				Task.addTask(''+data.modedetail._id, {'modedetail' : modedetail}, (data, callback)=>{
					io.of('/'+data.modedetail.device.room).emit('control-board', 'true'+data.modedetail.device._id);
				}, activityOn, stoptime);

				let activityOff = '0 '+ (mm+data.modedetail.schedule.ontime/3600)+'/'+permm+' '+(hhmm+data.modedetail.schedule.ontime%3600/60)+'/'+perhh+' * * '+circle;

				Task.addTask(''+data.modedetail._id, {'modedetail' : modedetail}, (data, callback)=>{
					io.of('/'+data.modedetail.device.room).emit('control-board', 'false'+data.modedetail.device._id);
				}, activityOff, stoptime);
			}

		});
	}).catch(e=>{
		console.log(e);
	})
}

Scheduler.removeTask = (id_mode, user)=>{
	Mode.getFullDetail(user, id_mode).then(mode=>{
		mode.data.modedetail.forEach(modedetail=>{
			Task.removeTask(''+data.modedetail._id, ()=>{
				console.log('Remove task: '+data.modedetail._id);
			})
		});
	}).catch(e=>{
		console.log(JSON.stringify(e));
	})
}
module.exports = exports =Scheduler;


