import axios from 'axios';

const API_PATH = "https://us-central1-testproject-27907.cloudfunctions.net/login/";


const loginProvider = {
    getNonceToSign: async (address) => {
        const response = await axios.post(API_PATH+'getNonceToSign', {
            address: address
        });

        const { nonce } = response.data;

        console.log(nonce)

        return nonce;

    },
    login: async (address, signature) => {
        console.log(address, signature)
        const response = await axios.post(API_PATH+'verifySeignedMessage', {
            address: address,
            signature: signature,
        });
        console.log(response)
        window.token = response.data.token;
        return response.data.token;
    }
}

export default loginProvider;