const cron = require("node-cron");
const {
    processData
} = require("./process");

var crontab = "5,20,35,50 * * * *";

cron.schedule(crontab, () => {
    //console.log(`---STARTING CRON JOB EVERY 15 MIN---`);
    processData();
});
