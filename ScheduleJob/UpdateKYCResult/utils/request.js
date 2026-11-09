const fetch = require('node-fetch');
const Parameters = require('./parameters.json');

function request(url, option) {
    const options = {
        ...option,
    };
    const defaultOptions = {
        "headers": {
            "content-type": "application/json",
            "accept": "application/json",
        },
    };
    const newOptions = { ...defaultOptions, ...options };
    return fetch(Parameters["baseUrl"] + url, newOptions)
};

module.exports = {
  request
}
