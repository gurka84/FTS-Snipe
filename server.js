const Web3 = require('web3');

// Connect to the BSC network
const web3 = new Web3('https://bsc-dataseed.binance.org/');

// The address you want to check the balance of ETH
const contractAddress = '0x5F3EF8B418a8cd7E3950123D980810A0A1865981';

// The contract fETH address of the token you want to check = ETH
const ethAddress = '0x2170Ed0880ac9A755fd29B2688956BD959F933F8';

// The contract ABI of the token
const ethABI = [
  // Add the ABI of the token contract here
  // For example:
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

// Function to check the token balance
const checkTokenBalance = async () => {
  try {
    // Get the token balance
    const ethBalance = await ethContract.methods.balanceOf(contractAddress).call();

    // Print the token balance
    console.log(`Contract ETH Balance: ${ethBalance}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

//CHECK THE fETH BALANCE ON USERS WALLET

// The address you want to check the balance of fETH
const userAddress = '0xa94e7307d9efb0d11adf07ba2ed122b303e2c77e';

// The contract fETH token to get wallet balace
const fethAddress = '0x5F3EF8B418a8cd7E3950123D980810A0A1865981';

// The contract ABI of the token
const fethABI = [
  // Add the ABI of the token contract here
  // For example:
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
  // Add more functions or events as needed
];

// Create a contract instance using the token address and ABI
const fethContract = new web3.eth.Contract(fethABI, fethAddress);

// Function to check the token balance
const checkfETHBalance = async () => {
  try {
    // Get the token balance
    const fethBalance = await fethContract.methods.balanceOf(userAddress).call();

    // Print the token balance
    console.log(`Wallet fETH Balance: ${fethBalance}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Set a 1-second interval to check the token and BNB balances continuously
setInterval(async () => {
  await checkTokenBalance();
  await checkfETHBalance()
}, 1000);