const cron = require("node-cron");
const {
    processData
} = require("./process");

var crontab = "8,23,38,53 * * * *";

cron.schedule(crontab, () => {
    //cron job every midnight day at 00:01
    //console.log(`---STARTING CRON JOB EVERY 15 MIN---`);
    processData();
});
