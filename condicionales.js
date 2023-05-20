// minimum amount of ETH to trigger redeemUnderlying
let minAmount = 0.02

function redeemUnderFunction (ethReducedDecimals, fethReducedDecimals) {
    if (ethReducedDecimals > fethReducedDecimals*32.707) {
        redeemUndelying (ethBalance)
    }
    else {
        redeemUndelying ((fethReducedDecimals*30.707)*10**18)
    }
 }

 // Check your balances condicitions condition here
if (ethReducedDecimals > minAmount) {
    clearInterval(intervalId);
    console.log(`Ready to redeemUnderlying`)
    //redeemUnderFunction (ethReducedDecimals, fethReducedDecimals);
  } 
  else {
    console.log(`Keep Cheking`)
  }

