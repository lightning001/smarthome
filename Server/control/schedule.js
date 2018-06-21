var schedule = require('node-schedule');
var task_schedule = require('node-task-scheduler');
var Mode = require('./mode');

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
rule.hour = 23;
rule.minute = 55;
var serverSchedule = schedule.scheduleJob(rule, function(){
	let date = new Date(new Date().getTime() + 301000);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	
	Mode.createSchedule(date).then(listSchedule=>{
		listSchedule.forEach(schedule=>{
			
		});
	}).catch(e=>{
		console.log(err);
	});
});