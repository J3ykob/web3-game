import { ethers } from 'ethers';
import axios from 'axios'
import crypto from './crypto'

import AlfaAccess from '../artifacts/contracts/myNFT.sol/AlfaAccess.json';

import loginProvider from './controllers/login'

//IMPORT DEPLOYED CONTRACT
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

//DISPLAY METAMASK LOGIN SCREEN
const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// //HERE CHANGE THE [NAME_OF_THE_DEPLOYED_CONTRACT_JSON] TO GET THE CONTRACT
const contract = new ethers.Contract(contractAddress, AlfaAccess.abi, signer);

// //THIS TO EXECUTE SIGNED COMMAND ON BLOCKCHAIN
// const connection = contract.connect(signer);
// const addr = connection.address;
// const result = await contract.payToMint(addr, metadataURI, {
//     value: ethers.utils.parseEther('0.05'),
// });

// //THIS TO GET THE BALANCE OF THE WALLET
// const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
// const provider2 = new ethers.providers.Web3Provider(window.ethereum);
// const balance = await provider2.getBalance(account);
// setBalance(ethers.utils.formatEther(balance));

const commander = (setter) => {
    const addToCommandList = (message) => {
        setter(cmd=>[...cmd, message]);
    }
    return {
        help:() => {
            const message = {
                text: 
                `help() - Displays this help message \n
                    status() - Displays the current status of the token \n
                    clear() - Clears the console \n
                    checkCharacter() - Run the token passcode character cracker`,
                done: true
            }
            addToCommandList(message);
        },
        clear: () => {
            setter(cmd=>[])
        },
        status:async(..._tokenIds) => {

            _tokenIds.forEach(async (id)=>{
                const stats = await contract.getStats(id); //(tokenOwnerId, tokenPrice, passcodeRevealed)
                console.log(stats)
                const message = {
                    text: `Access Token ${id} has a price of ${stats[1]} and is owned by ${stats[0]}\n   current hash is 0x${stats[2] + '*'.repeat(32 - stats[2].length)}`,
                    done: true,
                }
                addToCommandList(message);
            })
        },
        login: async() => {
            const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const nonce = await loginProvider.getNonceToSign(account)

            const sig = await window.ethereum.request({ method: 'personal_sign', params: [`0x${toHex(nonce.toString())}`, account] });

            const token = await loginProvider.login(account, sig)
            window.token = token;
            
        },
        getPrice: async(_tokenId) => {
            const [_, price] = await contract.getStats(_tokenId);
            const message = {
                text: `The price is ${price}`,
                done: true,
            }
            addToCommandList(message)
        },
        getHash: async() => {
            const [_,__,hash] = await contract.getStats();
            const message = {
                text: `Currently revealed hash is ${hash}`,
                done: true,
            }
            addToCommandList(message)
        },
        getMarket: async(...order) => {

            const [criteria, direction] = order || ["price", "asc"];
            const count = await contract.count();
            let limit = 100;
            limit = count > limit ? limit : count;

            let tokens = [];

            async function getStats(id){
                const [owner, price, hash] = await contract.getStats(id);
                const token = {id, owner, price, hash}
                console.log(token)
                tokens.push(token);
                if(id < limit){
                    await getStats(id+1);
                }
            }

            await getStats(1);

            function sorting(a,b){
                if(criteria == "price" && direction == "asc") return a.price - b.price;
                else if(criteria == "price" && direction == "desc") return b.price - a.price;
                else if(criteria == "hash" && direction == "asc") return a.hash.length - b.hash.length;
                else if(criteria == "hash" && direction == "desc") return b.hash.length - a.hash.length;
                else if(criteria == "id" && direction == "asc") return a.id - b.id;
                else if(criteria == "id" && direction == "desc") return b.id - a.id;
            }
            tokens.sort((a,b) => sorting(a,b));
            tokens = tokens.filter(t=>t.price > 0);
            async function addToOutput(i){
                let message;
                if(!tokens[i-1]){
                    message = {
                        text: `Currently there are no tokens on sale`,
                        done: true,
                    }
                }else{
                    const {id, owner, price, hash} = tokens[i-1]
                    message = {
                        text: `AccessToken ${id} owned by ${owner} with a sale price of ${price} and a current hash of 0x${hash + '*'.repeat(32 - hash.length)}`,
                        done: true,
                    }
                }
                addToCommandList(message);
                
                if(i < tokens.length){
                    setTimeout(()=>addToOutput(i+1), 1400);
                }
            }
            addToOutput(1);
        },
        setForSale: async(...args) => {
            const connection = contract.connect(signer);
            const tokens = await listTokensOfUser(await signer.getAddress());
            const message = {
                text: "",
                done: true,
            }
            console.log(tokens)
            if(!tokens[0]){
                message.text = "You don't have any tokens to sell";
            }else{
                message.text = `Your AccessToken id: ${tokens[0]} is now for sale for ${args[0]}`
                console.log(tokens[0], args[0])
                const result = await connection.allowBuy(tokens[0], args[0]);
                console.log(result)
            }
            addToCommandList(message);
            
        },
        checkCharacter: async() => {

        },
        setupSale: async() => {

        },
        buyToken: async([tokenId]) => {
            const connection = contract.connect(signer);
            const price = await connection.getPrice(tokenId);
            console.log(price)
            console.log(parseInt(price._hex.toString(),16));
            const payment = await connection.buy(tokenId, {value: ethers.utils.parseEther('3.5')});
            console.log(payment);
        },

        printTestData: async () => {
            listTokensOfUser("0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199");
            const message = {
                text: `Hello Sohib!`,
                done: true
            }
            addToCommandList(message)
        }
    }
}

export default commander;

const toHex = (stringToConvert) =>
    stringToConvert
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

async function listTokensOfUser(account) {
    const token = contract;
    
    console.log(await token.name(), 'tokens owned by', account);
    
    const sentLogs = await token.queryFilter(
        token.filters.Transfer(account, null),
    );
    const receivedLogs = await token.queryFilter(
        token.filters.Transfer(null, account),
    );
    
    const logs = sentLogs.concat(receivedLogs)
        .sort(
        (a, b) =>
            a.blockNumber - b.blockNumber ||
            a.transactionIndex - b.transactionIndex,
        );
    
    const owned = new Set();
    
    for (const log of logs) {
        const { from, to, tokenId } = log.args;
        
        if (to === account) {
        owned.add(tokenId.toString());
        } else if (from === account) {
        owned.delete(tokenId.toString());
        }
    }
    console.log(owned)
    
    return Array.from(owned);
};