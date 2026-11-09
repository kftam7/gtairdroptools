const express = require('express');
const router = express.Router();
const gtapiServices = require('../services/gtapiServices');
const logger = require("../logger");

/* GET crypto */
router.get('/crypto/:login', async function(req, res, next) {
  try {
    res.json(await gtapiServices.getCrypto(req.params.login));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET email */
router.get('/email/:login', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getEmail(req.params.login));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET credential */
router.get('/credential/:login', async function(req, res, next) {
  try {
    res.json(await gtapiServices.getCredential(req.params.login, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET credential (get all) */
router.get('/credential', async function(req, res, next) {
  try {
    res.json(await gtapiServices.getCredential());
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET keyinfo */
router.get('/keyinfo/:key', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getKeyInfo(req.params.key, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET emailAddress */
router.get('/emailaddress', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getEmailAddress());
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET emailTemplate with ID*/
router.get('/emailtemplate/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getEmailTemplate(req.params.id));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET emailTemplate without ID*/
router.get('/emailtemplate', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getEmailTemplate());
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET emailTemplate by userID */
router.get('/useremailtemplate/:id/:chain', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getUserEmailTemplate(req.params.id, req.params.chain));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET emailTemplateLookup by userID */
router.get('/emailtemplatelookup/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getEmailTemplateLookup(req.params.id));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET airdropCampaign by ID */
router.get('/airdropcampaign/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getAirdropCampaign(req.params.id));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET airdropCampaign (All) */
router.get('/airdropcampaign', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getAirdropCampaign());
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET airdropList by CamapiagnID */
router.get('/airdroplist/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getAirdropList(req.params.id));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* GET airdropList (All) */
router.get('/airdroplist', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.getAirdropList());
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while getting  `, err.message);
    next(err);
  }
});

/* POST crypto */
router.post('/crypto/:login', async function(req, res, next) {
  try {
    res.json(await gtapiServices.createCrypto(req.params.login, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

/* POST email */
router.post('/email/:login/:templateID/:chain/:tokenAddress/:ifKYC/:expire', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.createEmail(req.params.login, req.params.templateID, req.params.chain, req.params.tokenAddress, req.params.ifKYC, req.params.expire, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

/* POST credential */
router.post('/credential/:name', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.createCredential(req.params.name, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

/* POST emailTemplate */
router.post('/emailaddress', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.createEmailAddress(req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

/* POST emailTemplate */
router.post('/emailtemplate/:name', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.createEmailTemplate(req.params.name, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while creating programming language`, err.message);
    next(err);
  }
});

/* PUT crypto */
router.put('/crypto/:key', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.updateCrypto(req.params.key, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

/* PUT credential */
router.put('/credential/:name', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.updateCredential(req.params.name, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

/* PUT emailAddress */
router.put('/emailaddress/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.updateEmailAddress(req.params.id, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

/* PUT emailTemplate */
router.put('/emailtemplate/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.updateEmailTemplate(req.params.id, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});

/* PUT emailTemplateLookup */
router.put('/emailtemplatelookup/:id', async function(req, res, next) {  
  try {
    res.json(await gtapiServices.updateEmailTemplateLookup(req.params.id, req.body));
  } catch (err) {
    logger.log('error', 'Error while getting %s', err.message);
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
});
module.exports = router;
