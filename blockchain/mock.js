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

  createTransaction(record, actor = 'Unknown') {
    const transaction = {
      ...record,
      timestamp: Date.now(),
      performedBy: actor,
      hash: this.calculateHash(record)
    };
    
    this.pendingTransactions.push(transaction);
    this.minePendingTransactions();
    return transaction.hash;
  }

  logAccess(recordId, actor, organization) {
    const log = {
      recordId,
      action: 'ACCESS_VIEW',
      actor,
      organization,
      timestamp: Date.now(),
      hash: this.calculateHash({ recordId, actor, action: 'ACCESS_VIEW' })
    };
    this.pendingTransactions.push(log);
    this.minePendingTransactions();
    return log.hash;
  }

  logIntervention(recordId, intervention, actor, organization) {
    const log = {
      recordId,
      action: 'INTERVENTION_ADDED',
      interventionType: intervention.type,
      actor,
      organization,
      timestamp: Date.now(),
      hash: this.calculateHash({ recordId, intervention, actor })
    };
    this.pendingTransactions.push(log);
    this.minePendingTransactions();
    return log.hash;
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
