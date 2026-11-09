const moment = require('moment');
const db = require('./db');
const sleep = require('sleep-promise');
const logger = require("./logger");
const config = require("./config");
const { Alchemy, Network } = require('alchemy-sdk');

// const processData = async () => {
var processData = function () {
	
	(async () => {

		// Alchemy configuration
		const setting = {
		  apiKey: config.alchemy.apiKey, // Replace with your Alchemy API key.
		  network: config.alchemy.network // Replace with your network.			
		};
		const alchemy = new Alchemy(setting);

		// search campaigns that is still in progress
		const currentTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000).toJSON().slice(0, 19).replace('T', ' ');
		var selectSQL = "SELECT campaignID, campaignName, contractAddress FROM airdropCampaign WHERE startTime <= '" + currentTime + "' AND endTime >= '" + currentTime + "';";
		const selectResult = await db.query(
		  selectSQL
		);

		// for each campaign, get the transfer list
		for (var i = 0; i < selectResult.length; i++){
			logger.log('info', 'Found Campaign: %s, %s, %s', selectResult[i].campaignID, selectResult[i].campaignName, selectResult[i].contractAddress);
			const res = await alchemy.core.getAssetTransfers({
				fromBlock: "0x0",
				toBlock: "latest",
				fromAddress: selectResult[i].contractAddress,
				excludeZeroValue: true,
				withMetadata: true,
				category: ["erc20"]
			});
			// for each txn, update the airdropList record
			for (var j = 0; j < res.transfers.length; j++){
				//update result				
				const blockTimestamp = moment.utc(res.transfers[j].metadata.blockTimestamp).tz("Asia/Hong_Kong").format("YYYY-MM-DD HH:mm:ss");
				var updateSQL = "UPDATE airdropList SET claimTime = '" + blockTimestamp + "', txnHash = '" + res.transfers[j].hash + "' WHERE campaignID = '" + selectResult[i].campaignID + "' AND UPPER(walletID) = UPPER('" + res.transfers[j].to + "');"; 
				logger.log('info', 'Found Txn: %s, %s, %s', res.transfers[j].to, blockTimestamp, res.transfers[j].hash);
				//console.log("updateSQL: %s", updateSQL);
				const updateResult = await db.query(
		  			updateSQL
				);
			}
		}
		db.release;
	})()
}

// export default processData;
module.exports = {
	processData: processData,
}
