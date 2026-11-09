const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');
const emailContents = require('../emailContents.json');
const reservedKeywords = require('../reserved_keywords.json');
const moment = require('moment');
const sleep = require('sleep-promise');
const logger = require("../logger");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

/* get crypto */
async function getCrypto(login){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE name LIKE "' + login + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Login doesn\'t exist', login, 'getCrypto');
    let message = 'Login doesn\'t exist';
    return {message};
  }

  logger.log('info', '%s %s', login, 'getCrypto');

  // check if admin
  const isAdmin = await db.query(
    'SELECT isAdmin FROM credential WHERE name LIKE "' + login + '"'
  );

  /* get the records */
  if (isAdmin[0].isAdmin){
    var rows = await db.query(
      'SELECT * FROM crypto ORDER BY cryptoId desc'
    );
  }else {
    var rows = await db.query(
      'SELECT * FROM crypto WHERE user LIKE "' + login + '" ORDER BY cryptoId desc'
    );  
  }

  const data = helper.emptyOrRows(rows);
  const meta = "1";

  return {
    data,
    meta
  }
}

/* get email */
async function getEmail(login){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE name LIKE "' + login + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Login doesn\'t exist', login, 'getEmail');
    let message = 'Login doesn\'t exist';
    return {message};
  }

  logger.log('info', '%s %s', login, 'getEmail');

  // check if admin
  const isAdmin = await db.query(
    'SELECT isAdmin FROM credential WHERE name LIKE "' + login + '"'
  );

  /* get the records */
  if (isAdmin[0].isAdmin){
    var rows = await db.query(
      'SELECT * FROM email ORDER BY emailID desc'
    );
  }else {
    var rows = await db.query(
      'SELECT * FROM email WHERE user LIKE "' + login + '" ORDER BY emailID desc'
    );  
  }

  const data = helper.emptyOrRows(rows);
  const meta = "1";

  return {
    data,
    meta
  }

}

/* get credential */
async function getCredential(login){

  if (login){
    // check if login exist
    const ifExist = await db.query(
      'SELECT count(*) as ifExist FROM credential WHERE name LIKE "' + login + '"'
    );
    if (!ifExist[0].ifExist){
      logger.log('error', '%s %s Login doesn\'t exist', login, 'getCredential');
      let message = 'Login doesn\'t exist';
      return {message};
    }
  
    logger.log('info', '%s %s', login, 'getCredential');
  
    var rows = await db.query(
      'SELECT credentialID, credential, isAdmin FROM credential WHERE name ="' + login + '"'
    );
    var credentialID = rows[0].credentialID;
    var credential = rows[0].credential;
    var isAdmin = rows[0].isAdmin;
  
    return {
      credentialID,
      credential,
      isAdmin
    }
  }else{
    logger.log('info', '%s', 'getCredential');
    var rows = await db.query(
      'SELECT credentialID, name, isAdmin, isActive FROM credential ORDER BY credentialID'
    );
    const data = helper.emptyOrRows(rows);
    return {
      data
    }
  }
}

/* get keyinfo */
async function getKeyInfo(key){

  // check if key exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM email WHERE uniqueKey ="' + key + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Key doesn\'t exist', key, 'getKeyInfo');
    let message = 'Key doesn\'t exist';
    return {message};
  }

  logger.log('info', '%s %s', key, 'getKeyInfo');

  const rows = await db.query(
    'SELECT chain, emailAddress, KYC, expiry, walletAddress FROM email WHERE uniqueKey ="' + key + '"'
  );
  const chain = rows[0].chain;
  const emailAddress = rows[0].emailAddress;
  const KYC = rows[0].KYC;
  const expiry = rows[0].expiry;
  const walletAddress = rows[0].walletAddress;

  return {
    chain,
    emailAddress,
    KYC,
    expiry,
    walletAddress
  }
}

/* get emailTemplate */
async function getEmailAddress(){

    logger.log('info', '%s', 'getEmailAddress');
    const rows = await db.query(
      'SELECT addressID, email, clientID, clientSecret, redirectURI, refreshToken, isActive FROM gtapi.emailFromAddress ORDER BY addressID'
    );
    const data = helper.emptyOrRows(rows);
    return {
      data
    }

}

/* get emailTemplate */
async function getEmailTemplate(id){

  // check if id exist
  if(id){
    const ifExist = await db.query(
      'SELECT count(*) as ifExist FROM emailTemplate WHERE emailTemplateID ="' + id + '"'
    );
    if (!ifExist[0].ifExist){
      logger.log('error', '%s %s ID doesn\'t exist', id, 'getEmailTemplate');
      let message = 'ID doesn\'t exist';
      return {message};
    }
    logger.log('info', '%s %s', id, 'getEmailTemplate');
    const rows = await db.query(
      'SELECT a.emailTemplateID, a.name, b.email, a.subjectBSC, a.contentBSC, a.subjectPolygon, a.contentPolygon, a.isActive FROM emailTemplate a, emailFromAddress b WHERE a.emailTemplateID ="' + id + '" AND a.addressID = b.addressID ORDER BY a.emailTemplateID'
    );
    const data = helper.emptyOrRows(rows);
    return {
      data
    }
  }else{
    logger.log('info', '%s', 'getEmailTemplate');
    const rows = await db.query(
      'SELECT a.emailTemplateID, a.name, b.email, a.subjectBSC, a.contentBSC, a.subjectPolygon, a.contentPolygon, a.isActive FROM emailTemplate a, emailFromAddress b WHERE a.addressID = b.addressID ORDER BY a.emailTemplateID'
    );
    const data = helper.emptyOrRows(rows);
    return {
      data
    }
  }
}

/* get user emailTemplate */
async function getUserEmailTemplate(id, chain){

  // check if id exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE credentialID ="' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s ID doesn\'t exist', id, 'getUserEmailTemplate');
    let message = 'ID doesn\'t exist';
    return {message};
  }
  logger.log('info', '%s %s', id, 'getUserEmailTemplate');
  if (chain.toUpperCase() === "BSC"){
    var rows = await db.query(
      'SELECT c.credentialID, a.emailTemplateID, a.name, b.email, a.subjectBSC AS subject, a.contentBSC AS content, a.isActive FROM emailTemplate a, emailFromAddress b, emailTemplateLookup c WHERE a.addressID = b.addressID AND a.emailTemplateID = c.emailTemplateID AND a.isActive = 1 AND c.credentialID = "' + id + '" order by a.emailTemplateID'
    );
  }else{
    var rows = await db.query(
      'SELECT c.credentialID, a.emailTemplateID, a.name, b.email, a.subjectPolygon AS subject, a.contentPolygon AS content, a.isActive FROM emailTemplate a, emailFromAddress b, emailTemplateLookup c WHERE a.addressID = b.addressID AND a.emailTemplateID = c.emailTemplateID AND a.isActive = 1 AND c.credentialID = "' + id + '" order by a.emailTemplateID'
    );    
  }
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

/* get user emailTemplateLookup */
async function getEmailTemplateLookup(id){

  // check if id exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE credentialID ="' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s ID doesn\'t exist', id, 'getEmailTemplateLookup');
    let message = 'ID doesn\'t exist';
    return {message};
  }
  logger.log('info', '%s %s', id, 'getEmailTemplateLookup');
  const rows = await db.query(
    'SELECT emailTemplateID FROM emailTemplateLookup WHERE credentialID = "' + id + '" order by emailTemplateID'
  );
  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

/* get airdropCampaign */
async function getAirdropCampaign(id){

  /*
  // check if id exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM airdropCampaign WHERE campaignID ="' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s ID doesn\'t exist', id, 'getAirdropCampaign');
    let message = 'ID doesn\'t exist';
    return {message};
  }
  */

  logger.log('info', '%s %s', id, 'getAirdropCampaign');

  if (id){
    var rows = await db.query(
    'SELECT campaignID, campaignName, startTime, endTime, description, whitelistURL, merkleRoot FROM airdropCampaign WHERE campaignID = "' + id + '"'
    );
  }else{
    var rows = await db.query(
    'SELECT campaignID, campaignName, startTime, endTime, description, whitelistURL, merkleRoot FROM airdropCampaign ORDER BY campaignID'
    );   
  }

  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

/* get airdropList */
async function getAirdropList(id){

  /*
  // check if id exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM airdropCampaign WHERE campaignID ="' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s ID doesn\'t exist', id, 'getAirdropCampaign');
    let message = 'ID doesn\'t exist';
    return {message};
  }
  */

  logger.log('info', '%s %s', id, 'getAirdropList');

  if (id){
    var rows = await db.query(
    'SELECT a.campaignID, a.campaignName, b.walletID, b.noToken, b.claimTime FROM airdropCampaign a, airdropList b WHERE a.campaignID = b.campaignID AND a.campaignID = "' + id + '" ORDER BY b.listID'
    );
  }else{
    var rows = await db.query(
    'SELECT a.campaignID, a.campaignName, b.walletID, b.noToken, b.claimTime FROM airdropCampaign a, airdropList b WHERE a.campaignID = b.campaignID ORDER BY a.campaignID, b.listID'
    );   
  }

  const data = helper.emptyOrRows(rows);
  return {
    data
  }
}

/* create crypto */
async function createCrypto(login, cryptoRecord){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE name LIKE "' + login + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Login doesn\'t exist', login, 'createCrypto');
    let message = 'Login doesn\'t exist';
    return {message};
  }

  logger.log('info', '%s %s', login, 'createCrypto');

  // construct the SQL statement
  var sql = 'INSERT INTO crypto (user, sendTime, chain, tokenAddress, walletAddress, tokenNo, gasPrice, gasLimit, note, txnHash, success) VALUES ';

  for (var i =0; i < cryptoRecord.length; i++){

    /* combine into 1 single SQL */
    if (i == (cryptoRecord.length-1)){
      sql = sql + '("' + cryptoRecord[i].user + '", "' + cryptoRecord[i].sendTime + '", "' + cryptoRecord[i].chain + '", "' + cryptoRecord[i].tokenAddress + '", "' + cryptoRecord[i].walletAddress + '", ' + cryptoRecord[i].tokenNo + ', ' + cryptoRecord[i].gasPrice + ', ' + cryptoRecord[i].gasLimit + ', "' + cryptoRecord[i].note + '", "' + cryptoRecord[i].txnHash + '", ' + cryptoRecord[i].success + ')';
    }else{
      sql = sql + '("' + cryptoRecord[i].user + '", "' + cryptoRecord[i].sendTime + '", "' + cryptoRecord[i].chain + '", "' + cryptoRecord[i].tokenAddress + '", "' + cryptoRecord[i].walletAddress + '", ' + cryptoRecord[i].tokenNo + ', ' + cryptoRecord[i].gasPrice + ', ' + cryptoRecord[i].gasLimit + ', "' + cryptoRecord[i].note + '", "' + cryptoRecord[i].txnHash + '", ' + cryptoRecord[i].success + '),';
    }

  }

  // update results on DB
  const result = await db.query(
    sql
  );

  // will return SQL error if fails, otherwise return the following succesful msg
  let message = 'Records added susccessfully';
  return {message};
  
}

/* create email */
async function createEmail(login, templateID, chain, tokenAddress, ifKYC, expire, emailRecord){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE name LIKE "' + login + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Login doesn\'t exist', login, 'createEmail');
    let message = 'Login doesn\'t exist';
    return {message};
  }

  logger.log('info', '%s %s', login, 'createEmail');

  // get email account info
  const result = await db.query(
    'SELECT b.email, b.clientID, b.clientSecret, b.redirectURI, b.refreshToken FROM emailTemplate a, emailFromAddress b WHERE a.addressID = b.addressID and a.emailTemplateID LIKE "' + templateID + '"'
  );

  // get the email settings from environmental variables
  const CLIENT_EMAIL = result[0].email;
  const CLIENT_ID = result[0].clientID;
  const CLIENT_SECRET = result[0].clientSecret;
  const REDIRECT_URI = result[0].redirectURI;
  const REFRESH_TOKEN = result[0].refreshToken;
  const OAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  );

logger.log('info', '%s %s', 'CLIENT_EMAIL: ', CLIENT_EMAIL);
logger.log('info', '%s %s', 'CLIENT_ID: ', CLIENT_ID);
logger.log('info', '%s %s', 'CLIENT_SECRET: ', CLIENT_SECRET);
logger.log('info', '%s %s', 'REDIRECT_URI: ', REDIRECT_URI);
logger.log('info', '%s %s', 'REFRESH_TOKEN: ', REFRESH_TOKEN);

 // complete the email settings
  OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/*
  // define the regular expressions
  const regEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const regDate = /(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})/;

  // get the email settings from environmental variables
  const CLIENT_EMAIL = process.env.REACT_APP_EMAIL;
  const CLIENT_ID = process.env.REACT_APP_EMAIL_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_EMAIL_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REACT_APP_EMAIL_CLIENT_REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REACT_APP_EMAIL_REFRESH_TOKEN;
  const OAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  );

 // complete the email settings
  OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
*/

  // try to create Transport
  try {


    // Generate the accessToken on the fly
    const accessToken = await OAuth2Client.getAccessToken();


   // Create the email envelope (transport)
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: CLIENT_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
      pool: true
    });


    /*
    // check expiry date format
    if (!regDate.test(emailRecord[i].expiry)){
      //console.log("Expiry Date checking failed");
      logger.log('error', '%s %s Expiry Date checking failed, %s', login, 'createEmail', emailRecord[i].expiry);
      continue;
    }


    // check if KYC value is 0 or 1
    if (ifKYC !== 0 && ifKYC !== 1) {
      //console.log("KYC value checking failed");
      logger.log('error', '%s %s KYC value checking failed, %s', login, 'createEmail', ifKYC);
      continue;
    }

    */

    // for each record
    for (var i = 0; i < emailRecord.length; i++){
/*

      // check email format
      if (!regEmail.test(emailRecord[i].emailAddress)){
        //console.log("Email format checking failed");
        logger.log('error', '%s %s Email format checking failed, %s', login, 'createEmail', emailRecord[i].emailAddress);
        continue;
      }


      // check expiry date format
      if (!regDate.test(emailRecord[i].expiry)){
        //console.log("Expiry Date checking failed");
        logger.log('error', '%s %s Expiry Date checking failed, %s', login, 'createEmail', emailRecord[i].expiry);
        continue;
      }

      // check if KYC value is 0 or 1
      if (emailRecord[i].KYC !== 0 && emailRecord[i].KYC !== 1) {
        //console.log("KYC value checking failed");
        logger.log('error', '%s %s KYC value checking failed, %s', login, 'createEmail', emailRecord[i].KYC);
        continue;
      }

      //check note length
      if (emailRecord[i].note.length > 1000) {
        //console.log("Note Length checking failed");
        logger.log('error', '%s %s Note Length checking failed, %s', login, 'createEmail', emailRecord[i].note.length);
        continue;
      }
*/
      // if all contents are correct, send email
      //const sendMailResult = await sendMail(login, templateID, chain, tokenAddress, ifKYC, expire, emailRecord[i], transport);
      const sendMailResult = await sendMail(login, templateID, chain, tokenAddress, ifKYC, expire, emailRecord[i], transport);


      //sleep 2s
      await sleep(2000);
    }

	  transport.close();

  } catch (error) {
    logger.log('error', '%s %s Failed to create email transport', login, 'createEmail');
  }

  // return the following msg when operation completes
  let message = 'Email sending operations completed';
  return {message};
}

/* create credential */
async function createCredential(name, credentialRecord){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE name LIKE "' + name + '"'
  );
  if (ifExist[0].ifExist){
    logger.log('error', '%s %s Login already exist', name, 'createCredential');
    let message = 'Name already exist';
    return {message};
  }

  logger.log('info', '%s %s', name, 'createCredential');

  // update results on DB
  const result = await db.query(
    'INSERT INTO credential (`name`, `credential`, `isAdmin`, `isActive`) VALUES ("' + name + '", "' + credentialRecord.credential + '", ' + credentialRecord.isAdmin + ', ' + credentialRecord.isActive + '); '
  );

  // update results on DB
  const queryResult = await db.query(
    'SELECT credentialID FROM credential WHERE name LIKE "' + name + '"'
  );

  const createdID = queryResult[0].credentialID;
  // will return SQL error if fails, otherwise return the following succesful msg
  //let message = 'Records added susccessfully';
  //return {query[0].credentialID};
  return {createdID};
  
}

/* create emailAddress */
async function createEmailAddress(emailAddressRecord){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM emailFromAddress WHERE email LIKE "' + emailAddressRecord.email + '"'
  );
  if (ifExist[0].ifExist){
    logger.log('error', '%s %s Email Addresss already exist', emailAddressRecord.email, 'createEmailAddress');
    let message = 'Email Addresss already exist';
    return {message};
  }

  logger.log('info', '%s %s', emailAddressRecord.email, 'createEmailAddress');

  // update results on DB
  const result = await db.query(
    'INSERT INTO emailFromAddress (`email`, `clientID`, `clientSecret`, `redirectURI`, `refreshToken`, `isActive`) VALUES ("' + emailAddressRecord.email + '", "' + emailAddressRecord.clientID + '", "' + emailAddressRecord.clientSecret + '", "' + emailAddressRecord.redirectURI + '", "' + emailAddressRecord.refreshToken + '", 1);'
  );

  // will return SQL error if fails, otherwise return the following succesful msg
  let message = 'Records added susccessfully';
  return {message};
  
}

/* create emailTemplate */
async function createEmailTemplate(name, emailTemplateRecord){

  // check if login exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM emailTemplate WHERE name LIKE "' + name + '"'
  );
  if (ifExist[0].ifExist){
    logger.log('error', '%s %s Name already exist', name, 'createEmailTemplate');
    let message = 'Name already exist';
    return {message};
  }

  logger.log('info', '%s %s', name, 'createEmailTemplate');

  // update results on DB
  const result = await db.query(
    'INSERT INTO emailTemplate (`name`, `addressID`, `subjectBSC`, `subjectPolygon`, `contentBSC`, `contentPolygon`, `isActive`) VALUES ("' + name + '", "' + emailTemplateRecord.addressID + '", "' + emailTemplateRecord.subjectBSC + '", "' + emailTemplateRecord.subjectPolygon + '", "' + emailTemplateRecord.contentBSC + '", "' + emailTemplateRecord.contentPolygon + '", ' + emailTemplateRecord.isActive + '); '
  );

  // will return SQL error if fails, otherwise return the following succesful msg
  let message = 'Records added susccessfully';
  return {message};
  
}

/* update Crytpo */
async function updateCrypto(key, email){

  // check if key exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM email WHERE uniqueKey ="' + key + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Key doesn\'t exist', key, 'updateCrypto');
    let message = 'Key doesn\'t exist';
    return {message};
  }
  
  logger.log('info', '%s %s', key, 'updateCrypto');

  now = moment().format("YYYY-MM-DD HH:mm:ss");

  const result = await db.query(
    'UPDATE email SET walletAddress= "' + email.walletAddress + '", whenClicked = "' + now + '", linkClicked = 1' + ' WHERE uniqueKey="' + key + '"'
  );

  if (result.affectedRows) {
    message = 'Wallet address updated successfully';
  }

  return {message};
}

/* update Credential */
async function updateCredential(name, credentialRecord){

  // check if key exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE name ="' + name + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Name doesn\'t exist', name, 'updateCredential');
    let message = 'Name doesn\'t exist';
    return {message};
  }
  
  logger.log('info', '%s %s', name, 'updateCredential');

  const result = await db.query(
    'UPDATE credential SET credential= "' + credentialRecord.credential + '", isAdmin = ' + credentialRecord.isAdmin + ', isActive = ' + credentialRecord.isActive + ' WHERE name="' + name + '"'
  );

  if (result.affectedRows) {
    message = 'Credential updated successfully';
  }

  return {message};
}

/* update emailTemplate */
async function updateEmailAddress(id, emailAddressRecord){

  // check if key exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM emailFromAddress WHERE addressID = "' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s Email doesn\'t exist', id, 'updateEmailAddress');
    let message = 'Email doesn\'t exist';
    return {message};
  }
  
  logger.log('info', '%s %s', id, 'updateEmailAddress');

  const result = await db.query(
    'UPDATE emailFromAddress SET email = "' + emailAddressRecord.email + '", clientID = "' + emailAddressRecord.clientID + '", clientSecret = "' + emailAddressRecord.clientSecret + '", redirectURI = "' + emailAddressRecord.redirectURI + '", refreshToken = "' + emailAddressRecord.refreshToken + '", isActive = ' + emailAddressRecord.isActive + ' WHERE addressID = "' + id + '"'
  );

  if (result.affectedRows) {
    message = 'emailAddress updated successfully';
  }

  return {message};
}

/* update emailTemplate */
async function updateEmailTemplate(id, emailTemplateRecord){

  // check if key exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM emailTemplate WHERE emailTemplateID ="' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s ID doesn\'t exist', id, 'updateEmailTemplate');
    let message = 'ID doesn\'t exist';
    return {message};
  }
  
  logger.log('info', '%s %s', id, 'updateEmailTemplate');

  const result = await db.query(
    'UPDATE emailTemplate SET name = "' + emailTemplateRecord.name + '", addressID = "' + emailTemplateRecord.addressID + '", subjectBSC = "' + emailTemplateRecord.subjectBSC + '", subjectPolygon = "' + emailTemplateRecord.subjectPolygon + '", contentBSC = "' + emailTemplateRecord.contentBSC + '", contentPolygon = "' + emailTemplateRecord.contentPolygon + '", isActive = ' + emailTemplateRecord.isActive + ' WHERE emailTemplateID = "' + id + '"'
  );

  if (result.affectedRows) {
    message = 'emailTemplate updated successfully';
  }

  return {message};
}

/* update emailTemplateLookup */
async function updateEmailTemplateLookup(id, emailTemplateLookupRecord){

  // check if key exist
  const ifExist = await db.query(
    'SELECT count(*) as ifExist FROM credential WHERE credentialID ="' + id + '"'
  );
  if (!ifExist[0].ifExist){
    logger.log('error', '%s %s ID doesn\'t exist', id, 'updateEmailTemplateLookup');
    let message = 'ID doesn\'t exist';
    return {message};
  }
  
  logger.log('info', '%s %s', id, 'updateEmailTemplateLookup');

  // delete the old records
  const result = await db.query(
    'DELETE from emailTemplateLookup WHERE credentialID = "' + id + '"'  
  );


  // insert the new records
  for (var i =0; i < emailTemplateLookupRecord.length; i++){
    const result = await db.query(
      'INSERT into emailTemplateLookup (credentialID, emailTemplateID) VALUES (' + id + ', ' + emailTemplateLookupRecord[i].emailTemplateID + ')'
    );
  }
  
  // will return SQL error if fails, otherwise return the following succesful msg
  let message = 'emailTemplateLookup updated successfully';
  return {message};
  
}

/* generate unique ID */
function uniqueid(){
    // always start with a letter (for DOM friendlyness)
    var idstr=String.fromCharCode(Math.floor((Math.random()*25)+65));
    do {                
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode=Math.floor((Math.random()*42)+48);
        if (ascicode<58 || ascicode>64){
            // exclude all chars between : (58) and @ (64)
            idstr+=String.fromCharCode(ascicode);    
        }                
    } while (idstr.length<32);

    return (idstr);
}

/**
 * Sending the email 
 */
//async function sendMail(login, templateID, chain, tokenAddress, ifKYC, expire, emailRecord, transport) {
async function sendMail(login, templateID, chain, tokenAddress, ifKYC, expire, emailRecord, transport) {

  //console.log("emailRecord: ", emailRecord);

  var fromAddress = "";
  var emailSubject = "";
  var emailBody = "";

  now = moment().format("YYYY-MM-DD HH:mm:ss");

  // get email template info
  const result = await db.query(
    'SELECT b.email, a.subjectBSC, a.subjectPolygon, a.contentBSC, a.contentPolygon FROM emailTemplate a, emailFromAddress b WHERE a.addressID = b.addressID and a.emailTemplateID LIKE "' + templateID + '"'
  );
  fromAddress = result[0].email;
  if (chain.toLowerCase() === "bsc"){
    emailSubject = helper.urlDecode(result[0].subjectBSC);
    emailBody = helper.urlDecode(result[0].contentBSC);
  }else{
    emailSubject = helper.urlDecode(result[0].subjectPolygon);
    emailBody = helper.urlDecode(result[0].contentPolygon);
  }

  // replace reserved keywords in email body & subject
  let keysReservedKeywords = Object.keys(reservedKeywords);
  let valuesReservedKeywords = Object.values(reservedKeywords);
  for (var i =0; i < keysReservedKeywords.length; i++){
   
    var to_replace = '{{' + keysReservedKeywords[i] + '}}';
    var re = new RegExp(to_replace, 'g');

    emailBody = emailBody.replace(re, valuesReservedKeywords[i]);
    emailSubject = emailSubject.replace(re, valuesReservedKeywords[i]);
    
  }

  // replace variables in email body & subject
  let keysEmailRecord = Object.keys(emailRecord);
  let valuesEmailRecord = Object.values(emailRecord);
  for (var i =0; i < keysEmailRecord.length; i++){
   
    var to_replace = '{{' + keysEmailRecord[i] + '}}';
    var re = new RegExp(to_replace, 'g');

    //console.log("to_replace: %s", to_replace);
    //console.log("re: %s", re);
    //console.log("\n");


    emailBody = emailBody.replace(re, valuesEmailRecord[i]);
    emailSubject = emailSubject.replace(re, valuesEmailRecord[i]);
    
  }

  console.log("emailSubject: %s", emailSubject);
  console.log("emailBody: %s", emailBody);
  console.log("\n");

  let uniqueKey = uniqueid();

/*
  // Construct the email subject and contents
  let uniqueKey = uniqueid();
  if (emailRecord.KYC){
    emailSubject = emailContents.email_subject_KYC;
    emailBody = emailContents.email_body_KYC.replace("$datetime", emailRecord.expiry).replace("$url", emailContents.wallet_update_URL).replace("$uniquekey", uniqueKey).replace("$blockpass_url", emailContents.blockpass_URL);
    if (emailRecord.chain.toLowerCase() === "bsc"){
      emailBody = emailBody.replace("$blockpass_clientId", emailContents.blockpass_clientId_BSC);
    }else {
      emailBody = emailBody.replace("$blockpass_clientId", emailContents.blockpass_clientId_Polygon);
    }
  }else {
    emailSubject = emailContents.email_subject_non_KYC;
    emailBody = emailContents.email_body_non_KYC.replace("$datetime", emailRecord.expiry).replace("$url", emailContents.wallet_update_URL).replace("$uniquekey", uniqueKey);
  }
*/

  // complete the email options
  const mailOptions = {
    from: fromAddress,
    to: emailRecord.emailAddress,
    subject: emailSubject,
    html: emailBody,
  };


  try {
    // Set up the email options and delivering it
    const sendMailResult = await transport.sendMail(mailOptions);

    // check the result and record on DB
    if(sendMailResult.response.includes("OK")){
      logger.log('info', '%s %s Send Email Success, %s', login, 'createEmail', emailRecord.emailAddress);
      // Success
      const result = db.query(
        `INSERT INTO email (user, sendTime, chain, tokenAddress, emailTemplateID, emailAddress, tokenNo, expiry, KYC, uniqueKey, note, sendStatus)
        VALUES
        ("${login}", "${now}", "${chain}", "${tokenAddress}", "${templateID}", "${emailRecord.emailAddress}", ${emailRecord.tokenNo}, STR_TO_DATE("${expire}", "%Y%m%d%H%i%s"), ${ifKYC}, "${uniqueKey}", "${emailRecord.note}", 1)`
      );
    }else{
      logger.log('error', '%s %s Send Email Failed, %s, %s', login, 'createEmail', emailRecord.emailAddress, sendMailResult.response);
      // Fail
      const result = db.query(
        `INSERT INTO email (user, sendTime, chain, tokenAddress, emailTemplateID, emailAddress, tokenNo, expiry, KYC, uniqueKey, note, sendStatus)
        VALUES
        ("${login}", "${now}", "${chain}", "${tokenAddress}", "${templateID}", "${emailRecord.emailAddress}", ${emailRecord.tokenNo}, STR_TO_DATE("${expire}", "%Y%m%d%H%i%s"), ${ifKYC}, "${uniqueKey}", "${emailRecord.note}", 0)`
      );      
    }

    // return the result
    return sendMailResult;

  } catch(error){
      logger.log('error', '%s %s Send Email Error, $s, %s', login, 'createEmail', emailRecord.emailAddress, error);
      // Fail
      const result = db.query(
        `INSERT INTO email (user, sendTime, chain, tokenAddress, emailTemplateID, emailAddress, tokenNo, expiry, KYC, uniqueKey, note, sendStatus)
        VALUES
        ("${login}", "${now}", "${chain}", "${tokenAddress}", "${templateID}", "${emailRecord.emailAddress}", ${emailRecord.tokenNo}, STR_TO_DATE("${expire}", "%Y%m%d%H%i%s"), ${ifKYC}, "${uniqueKey}", "${emailRecord.note}", 0)`
      );
  }

}

module.exports = {
  getCrypto,
  getEmail,
  getCredential,
  getKeyInfo,
  createCrypto,
  createEmail,
  updateCrypto, 
  createCredential, 
  updateCredential,
  getEmailAddress,
  getEmailTemplate,
  createEmailAddress,
  createEmailTemplate,
  updateEmailAddress,
  updateEmailTemplate,
  getUserEmailTemplate,
  getEmailTemplateLookup,
  updateEmailTemplateLookup,
  getAirdropCampaign,
  getAirdropList
};
