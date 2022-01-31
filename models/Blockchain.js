class Blockchain {
  constructor() {
    this.blocks = [];
    this.currentPrime = 2;
  }
  addBlock(block) {
    this.blocks.push(block);
  }
  blockHeight() {
    return this.blocks.length;
  }
  getPrime() {
    return this.currentPrime;
  }
  setPrime(num) {
    this.currentPrime = num;
  }
}

module.exports = Blockchain;
