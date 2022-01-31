const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(num) {
    this.timestamp = Date.now();
    this.nonce = 1;
    this.transactions = [];
    this.prime = num;

  }
  addTransaction(tx) {
    this.transactions.push(tx);
  }
  hash() {
    return SHA256(
      this.timestamp + "" +
      this.nonce + "" +
      JSON.stringify(this.transactions)
    ).toString();
  }
  execute() {
    this.transactions.forEach(x => x.execute());
  }
}

module.exports = Block;
