import request from '../utils/request';

export async function chainApi(params) {
    return request(
        `/gtapi/keyinfo/${params}`
    )
};

export async function crypto(params) {
    return request(
        `/gtapi/crypto/${params.tokenID}`, {
            method: 'PUT',
            body: JSON.stringify({
                "walletAddress": `${params.account}`
              })
        }
    )
};
