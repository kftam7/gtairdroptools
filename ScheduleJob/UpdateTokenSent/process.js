const moment = require('moment');
const db = require('./db');
const sleep = require('sleep-promise');
const logger = require("./logger");

// const processData = async () => {
var processData = function () {
	
	(async () => {

		// get lastExecTime and currentTime
		var sql = "SELECT lastExecTime FROM gtapi.lastExecute WHERE process LIKE 'updateTotal'";
		const lastExecute = await db.query(
		  sql
		);
		const dateISO = lastExecute[0].lastExecTime;
		const dateMoment = moment.utc(dateISO).local();
		const lastExecTime = dateMoment.format('YYYY-MM-DD HH:mm:ss');
		const currentTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
		//console.log('Job started. Last Execution Time');
		logger.log('info', 'Job started. Last Execution Time: %s', lastExecTime);

		// get walletAddress that updated during this period
		sql = "SELECT DISTINCT walletAddress FROM gtapi.crypto WHERE sendTime BETWEEN '" + lastExecTime + "' AND '" + currentTime + "'";
		const walletList = await db.query(
		  sql
		);

		logger.log('info', 'No of distinct walletAddress between LastExecTime & CurrentTime: %i', walletList.length);

		// for each walletAddress, get the total token sent
		for (var i = 0; i < walletList.length; i++){
			sql = "SELECT walletAddress, chain, SUM(tokenNo) as totalTokenNo FROM gtapi.crypto WHERE walletAddress LIKE '" + walletList[i].walletAddress + "'" + " GROUP BY walletAddress, chain";
			const totalToken = await db.query(
		  		sql
			);
			logger.log('info', 'No of records to update for walletAddress %s: %i', walletList[i].walletAddress, totalToken.length);
			db.release;

			// update email table
			for (var j = 0; j < totalToken.length; j++){
				logger.log('info', 'walletAddress: %s, chain: %s, totalTokenNo: %i', totalToken[j].walletAddress, totalToken[j].chain, totalToken[j].totalTokenNo);
				sql = "UPDATE gtapi.email SET tokenSent = " + totalToken[j].totalTokenNo + " WHERE walletAddress LIKE '" + totalToken[j].walletAddress + "' AND chain LIKE '" + totalToken[j].chain + "'";
				const updateTokenNo = await db.query(
		  			sql
				);
				db.release;
				
				//sleep 2s
      			await sleep(2000);
			}

		}

		// update lastExecTime
		var sql = "UPDATE lastExecute SET lastExecTime = '" + currentTime + "' WHERE process LIKE 'updateTotal'";
		const updateTime = await db.query(
		  sql
		);

	})()
	//db.release;
}

// export default processData;
module.exports = {
	processData: processData,
}
