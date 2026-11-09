//import request from '../utils/request';
const request = require('../utils/request');

//export async function blockPassAPI(serviceID, refID) {
//async function blockPassAPI(serviceID, AuthKey, refID) {   
function blockPassAPI(serviceID, AuthKey, refID) { 

    const options = {
        method: 'GET',
        headers: {
            'Authorization': `${AuthKey}`
        }
    }

    return request.request(
        `/${serviceID}/refID/${refID}`, options
    )
};


module.exports = {
  blockPassAPI
}

