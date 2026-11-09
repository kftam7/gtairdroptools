const moment = require('moment');
const db = require('./db');
const blockPass = require('./services/blockPass');
const Parameters = require('./utils/parameters.json');
const logger = require("./logger");

var processData = function () {
	
	(async () => {

		// get lastExecTime and currentTime
		var sql = "SELECT lastExecTime FROM gtapi.lastExecute WHERE process LIKE 'updateKYCResult'";
		const lastExecute = await db.query(
		  sql
		);
		const dateISO = lastExecute[0].lastExecTime;
		const dateMoment = moment.utc(dateISO).local();
		const lastExecTime = dateMoment.format('YYYY-MM-DD HH:mm:ss');
		const currentTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
		logger.log('info', 'Job started. Last Execution Time: %s', lastExecTime);

		// get uniqueKey that haven't expired and KYC=1 and KYCResult=0
		sql = "SELECT uniqueKey, chain FROM email WHERE expiry >= '" + currentTime + "' AND KYC = 1 AND (KYCResult != 1 or KYCResult is NULL)";
		const uniqueKey = await db.query(
		  sql
		);
		logger.log('info', 'Found %i records', uniqueKey.length);


		// for each uniqueKey, query KYC result from BlockPass
		for (var i = 0; i < uniqueKey.length; i++){

			//check if KYC is approved on BlockPass
			const isApproved = await checkApproval(uniqueKey[i].chain, uniqueKey[i].uniqueKey);

			// if approved, set KYCResult=1 and update KYCResultUpdateTime
			if ( isApproved == 1){
				sql = "UPDATE email SET KYCResult = 1, KYCResultUpdateTime = '" + currentTime + "' WHERE uniqueKey LIKE '" + uniqueKey[i].uniqueKey + "'";
				const updateKYCResult = await db.query(
		  			sql
				);
			}
		}

		// update lastExecTime
		var sql = "UPDATE lastExecute SET lastExecTime = '" + currentTime + "' WHERE process LIKE 'updateKYCResult'";
		const updateTime = await db.query(
		  sql
		);
	})()
	db.release;
}

async function checkApproval (chain, uniqueKey) {

	var serviceID = "";
	var AuthKey = "";

	if (chain.toLowerCase().trim() === 'bsc'){
		serviceID = Parameters["bscServiceID"];
		AuthKey = Parameters["bscAuthKey"];
	
	}else if(chain.toLowerCase().trim() === 'polygon'){
		serviceID = Parameters["polygonServiceID"];
		AuthKey = Parameters["polygonAuthKey"];
	}

	const statusResult = await blockPass.blockPassAPI(serviceID, AuthKey, uniqueKey)
	    .then(response => response.json())
	    .then(response => {
	      if (response.data.status === Parameters["keywordApproved"]){
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, Parameters["keywordApproved"]);
	      	return 1;
	      }else if (response.data.status === Parameters["keywordRejected"]){
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, Parameters["keywordRejected"]);
	      	return 0;
	      }else if (response.data.status === Parameters["keywordIncomplete"]){
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, Parameters["keywordIncomplete"]);
	      	return 2;
	      }else if (response.data.status === Parameters["keywordWaiting"]){
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, Parameters["keywordWaiting"]);
	      	return 3;
	      }else if (response.data.status === Parameters["keywordInreview"]){
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, Parameters["keywordInreview"]);
	      	return 4;
	      }else if (response.data.status === Parameters["keywordBlocked"]){
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, Parameters["keywordBlocked"]);
	      	return 5;
	      }else {
	      	logger.log('info', 'UniqueKey: %s, Chain: %s, Status: %s', uniqueKey, chain, "Unknown");
	      	return -1;
	      }
	    })
	    .catch(err => {
	      logger.log('error', 'Error: %s', err);
	    })

	return statusResult;
}

// export default processData;
module.exports = {
	processData: processData,
}
