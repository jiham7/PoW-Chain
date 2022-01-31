const Block = require('./models/Block');
const Transaction = require('./models/Transaction');
const UTXO = require('./models/UTXO');
const db = require('./db');
const {PUBLIC_KEY} = require('./config');
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;
const currentPrime = db.blockchain.getPrime();


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

  const block = new Block();

  const nextPrime = (num = currentPrime) => {
    while(!isPrime(++num)){
      block.nonce++;
    };
    block.prime = num;
    db.blockchain.setPrime(num);
    return num;
  };

  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);


  block.execute();

  db.blockchain.addBlock(block);

  console.log(`Mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${block.nonce} and found new prime ${block.prime}`);

  setTimeout(mine, 2500);
}

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

module.exports = {
  startMining,
  stopMining,
};
