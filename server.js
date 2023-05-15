const Web3 = require('web3');

// Connect to BSC network using Infura provider
const provider = new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org');
const web3 = new Web3(provider);

const contractAddress = '0x5F3EF8B418a8cd7E3950123D980810A0A1865981';

const contract = new web3.eth.Contract(abi, contractAddress);


//chequeo de balance
async function getContractBalance() {
    const balance = await web3.eth.getBalance(contractAddress);
    return balance;
  }

//intervalo de chequeo de balance
  setInterval(async function() {
    const balance = await getContractBalance();
    console.log(`Contract balance: ${balance}`);
  }, 10000);

//redimir 
  async function redeemAsset(amount) {
    const tx = await contract.methods.redeemUnderlying(amount).send();
    console.log(`Redeemed ${amount} underlying asset. Transaction hash: ${tx.transactionHash}`);
  }
  
// intervalo de chequeo de redimir con x balance
  setInterval(async function() {
    try {
      const balance = await getContractBalance();
      console.log(`Contract balance: ${balance}`);
      
      if (balance > 275706900000000000) {
        await redeemAsset(balance);
      }
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  }, 10000);
  