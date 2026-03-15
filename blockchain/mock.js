/**
 * Mock Blockchain Implementation for Street Mobilization
 * This simulates the behavior of a blockchain for development purposes.
 */

const crypto = require('crypto');

class MockBlockchain {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.records = new Map(); // biometricHash -> record
  }

  createTransaction(record) {
    const transaction = {
      ...record,
      timestamp: Date.now(),
      hash: this.calculateHash(record)
    };
    
    this.pendingTransactions.push(transaction);
    this.minePendingTransactions();
    return transaction.hash;
  }

  calculateHash(record) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(record) + Date.now())
      .digest('hex');
  }

  minePendingTransactions() {
    const block = {
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: this.getLatestBlock()?.hash || '0'
    };
    
    block.hash = this.calculateHash(block);
    this.chain.push(block);
    
    // Update local records mapping
    block.transactions.forEach(tx => {
      this.records.set(tx.biometricHash, tx);
    });
    
    this.pendingTransactions = [];
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getRecord(biometricHash) {
    return this.records.get(biometricHash);
  }

  getAllRecords() {
    return Array.from(this.records.values());
  }
}

module.exports = new MockBlockchain();
