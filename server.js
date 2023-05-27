require('dotenv').config();
const { default: BigNumber } = require('bignumber.js');
const Web3 = require('web3');

// Connect to the BSC network
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.BSC_RPC_URL));

// The address you want to check the balance of ETH
const contractAddress = '0x5F3EF8B418a8cd7E3950123D980810A0A1865981';

//min amount of ETH to redeem
let minAmount = 0.02
let ethReducedDecimals
let intervalId 
let ethBalance
let fethBalance
const rate = 274883996

// The contract fETH address of the token you want to check = ETH
const ethAddress = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';

// The contract ABI of the token
const ethABI = [
  // Add the ABI of the token contract here
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  // Add more functions or events as needed
];

// Create a contract instance using the token address and ABI
const ethContract = new web3.eth.Contract(ethABI, ethAddress);

// The address you want to check the balance of fETH
const userAddress = '0xa94e7307d9efb0d11adf07ba2ed122b303e2c77e';

// The contract fETH token to get wallet balace
const fethAddress = '0x5F3EF8B418a8cd7E3950123D980810A0A1865981';

// The contract ABI of the token
const fethABI = [
  // Add the ABI of the token contract here
  {
    "constant": true,
    "inputs": [
      {
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
        {
            "internalType": "uint256",
            "name": "redeemAmount",
            "type": "uint256"
        }
    ],
    "name": "redeemUnderlying",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
},
];

// Create a contract instance
const fethContract = new web3.eth.Contract(fethABI, fethAddress);

// Example usage
let redeemAmount = new BigNumber(0);

// Prepare the transaction object
const transactionObject = {
  from: '0xa94e7307d9efb0d11adf07ba2ed122b303e2c77e', // Your wallet address
  to: fethAddress,
  gas: '200000', // Adjust the gas value according to your requirements
  gasPrice: '3000000000',
  data: fethContract.methods.redeemUnderlying(redeemAmount).encodeABI(),
};

// Sign and send transaction function

const signAndSendTransaction = (transactionObject) => {
  return new Promise((resolve, reject) => {
    web3.eth.accounts.signTransaction(transactionObject, process.env.PRIVATE_KEY)
      .then(signedTx => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          .on('receipt', receipt => {
            resolve(receipt); // Resolve the promise with the transaction receipt
          })
          .on('error', error => {
            reject(error); // Reject the promise with the transaction error
          });
      })
      .catch(error => {
        reject(error); // Reject the promise with the signing error
      });
  });
};

// Function to check the token balance
const checkTokenBalance = async () => {
  try {
    // Get the token balance
    fethBalance = new BigNumber(await fethContract.methods.balanceOf(userAddress).call());
    fethReducedDecimals = fethBalance.dividedBy(new BigNumber(10).exponentiatedBy(8));
    // Print the token balance
    console.log(`Wallet fETH Balance: ${fethReducedDecimals}`);
  } catch (error) {
    console.error('fETH Error:', error);
  }
  try {  
    // Get the token balance and reduce decimals
    ethBalance = new BigNumber(await ethContract.methods.balanceOf(contractAddress).call());
    ethReducedDecimals = ethBalance.dividedBy(new BigNumber(10).exponentiatedBy(18));

    // Print the token balance
    console.log(`Contract ETH Balance: ${ethReducedDecimals}`);
  } catch (error) {
    console.error('ETH Error:', error);
  }

  console.log("Minimal withraw amount:" + minAmount)

  // Check execution balance 
  if (ethReducedDecimals.isGreaterThanOrEqualTo(minAmount)) {
    clearInterval(intervalId);
    console.log(`Ready to redeemUnderlying`);
    redeemOptions()
      } 
  else {
  console.log(`Keep Cheking`)
  }
};

 // Check balance condicitions
function redeemOptions (){
  if (ethBalance.isGreaterThanOrEqualTo(fethBalance.multipliedBy(rate))) {
    redeemAmount = ethBalance.toFixed(); //update redeemAmount
  }
  else {
    redeemAmount = fethBalance.multipliedBy(rate).toFixed(); //update redeemAmount
  }
    
  transactionObject.data = fethContract.methods.redeemUnderlying(redeemAmount).encodeABI(); //update amount on transactionObject

  signAndSendTransaction(transactionObject) //send tx to BSC
    .then(receipt => {
    console.log('Transaction receipt:', receipt);
    // Transaction was successful, handle the response here
    })
    .catch(error => {
    console.error('Transaction error:', error);
    // Transaction failed, handle the error here
    });
}


// Set a 1-second interval to check ETH and fETH Balances
intervalId = setInterval(async () => {
  await checkTokenBalance();
}, 1000);