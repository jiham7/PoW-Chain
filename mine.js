const Block = require('./models/Block');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const db = require('./db');
const {PUBLIC_KEY} = require('./config');
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;


let mining = true;
mine();

function startMining() {
  mining = true;
  mine();
}

function stopMining() {
  mining = false;
}




function mine() {
  if(!mining) return;
  
  const isPrime = (num) => {
    let sqrtnum = Math.floor(Math.sqrt(num));
    let prime = num !== 1;
    for(let i = 2; i < sqrtnum + 1; i++){
       if(num % i === 0){
          prime = false;
          break;
       };
    };
    return prime;
  }
  const block = new Block(currentNum);
  console.log(`db.blockchain.getPrime(): ${db.blockchain.getPrime()}, currentNonce: ${block.nonce}`);
  var currentNum = db.blockchain.getPrime() + block.nonce;
  while(!isPrime(currentNum)){
    currentNum++;
    block.nonce++;
  };
  block.prime = currentNum;
  console.log(`current num is: ${currentNum}`);
  db.blockchain.setPrime(currentNum);
  console.log(`blockchain prime is ${db.blockchain.getPrime()}`);
  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);


  block.execute();

  db.blockchain.addBlock(block);

  console.log(`Mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${block.nonce}, height of ${db.blockchain.blockHeight()} and found new prime ${block.prime}`);

  setTimeout(mine, 2500);
}


module.exports = {
  startMining,
  stopMining,
};
