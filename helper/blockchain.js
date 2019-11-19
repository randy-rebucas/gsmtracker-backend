const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Record {
    /**
     * 
     * @param {*} recordFrom 
     * @param {*} recordType 
     * @param {*} recordData 
     */
    constructor(recordFrom, recordType, recordData) {
        this.recordFrom = recordFrom;
        this.recordType = recordType;
        this.recordData = recordData;
        this.timestamp = Date.now();
    }

    /**
     * Creates a SHA256 hash of the record
     *
     * @returns {string}
     */
    calculateRecordHash() {
        return SHA256(this.recordFrom + this.recordType + this.recordData + this.timestamp)
            .toString();
    }

    /**
     * Signs a record with the given signingKey (which is an Elliptic keypair
     * object that contains a private key). The signature is then stored inside the
     * record object and later stored on the blockchain.
     *
     * @param {string} signingKey
     */
    signRecord(signingKey) {
        // You can only send a record from the wallet that is linked to your
        // key. So here we check if the recordFrom matches your publicKey
        if (signingKey.getPublic('hex') !== this.recordFrom) {
            throw new Error('You cannot sign records for other wallets!');
        }


        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the record obect
        const hashTx = this.calculateRecordHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    /**
     * Checks if the signature is valid (transaction has not been tampered with).
     * It uses the recordFrom as the public key.
     *
     * @returns {boolean}
     */
    isValidRecord() {
        // If the transaction doesn't have a from address we assume it's a
        // mining reward and that it's valid. You could verify this in a
        // different way (special field for instance)
        if (this.recordFrom === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this record');
        }

        const publicKey = ec.keyFromPublic(this.recordFrom, 'hex');
        return publicKey.verify(this.calculateRecordHash(), this.signature);
    }
}

class Transaction {
    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    /**
     * Creates a SHA256 hash of the transaction
     *
     * @returns {string}
     */
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount + this.timestamp)
            .toString();
    }

    /**
     * Signs a transaction with the given signingKey (which is an Elliptic keypair
     * object that contains a private key). The signature is then stored inside the
     * transaction object and later stored on the blockchain.
     *
     * @param {string} signingKey
     */
    signTransaction(signingKey) {
        // You can only send a transaction from the wallet that is linked to your
        // key. So here we check if the fromAddress matches your publicKey
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }


        // Calculate the hash of this transaction, sign it with the key
        // and store it inside the transaction obect
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    /**
     * Checks if the signature is valid (transaction has not been tampered with).
     * It uses the fromAddress as the public key.
     *
     * @returns {boolean}
     */
    isValid() {
        // If the transaction doesn't have a from address we assume it's a
        // mining reward and that it's valid. You could verify this in a
        // different way (special field for instance)
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    /**
     * @param {number} timestamp
     * @param {Transaction[]} records
     * @param {string} previousHash
     */
    constructor(timestamp, records, previousHash = '') {
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        // this.transactions = transactions;
        this.records = records;
        this.nonce = 0;
        this.hash = this.calculateRecordHash();
    }

    /**
     * Returns the SHA256 of this block (by processing all the data stored
     * inside this block)
     *
     * @returns {string}
     */
    calculateRecordHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.records) + this.nonce).toString();
    }

    /**
     * Starts the mining process on the block. It changes the 'nonce' until the hash
     * of the block starts with enough zeros (= difficulty)
     *
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateRecordHash();
        }

        console.log(`Block mined: ${this.hash}`);
    }

    /**
     * Validates all the records inside this block (signature + hash) and
     * returns true if everything checks out. False if the block is invalid.
     *
     * @returns {boolean}
     */
    hasValidRecords() {
        for (const tx of this.records) {
            if (!tx.isValid()) {
                return false;
            }
        }

        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingRecords = [];
        this.miningReward = 100;
    }

    /**
     * @returns {Block}
     */
    createGenesisBlock() {
        return new Block(Date.parse('2017-01-01'), [], '0');
    }

    /**
     * Returns the latest block on our chain. Useful when you want to create a
     * new Block and you need the hash of the previous Block.
     *
     * @returns {Block[]}
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Takes all the pending records, puts them in a Block and starts the
     * mining process. It also adds a transaction to send the mining reward to
     * the given address.
     *
     * @param {string} miningRewardAddress
     */
    minePendingRecords(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingRecords.push(rewardTx);

        let block = new Block(Date.now(), this.pendingRecords, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingRecords = [];
    }

    /**
     * Add a new records to the list of pending records (to be added
     * next time the mining process starts). This verifies that the given
     * records is properly signed.
     *
     * @param {Records} record
     */
    addRecord(record) {
        if (!record.fromAddress || !record.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        // Verify the transactiion
        if (!record.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        if (record.amount <= 0) {
            throw new Error('Transaction amount should be higher than 0');
        }

        this.pendingRecords.push(record);
    }

    /**
     * Returns the balance of a given wallet address.
     *
     * @param {string} address
     * @returns {number} The balance of the wallet
     */
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.record) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    /**
     * Returns a list of all record that happened
     * to and from the given wallet address.
     *
     * @param  {string} address
     * @return {Transaction[]}
     */
    getAllTransactionsForWallet(address) {
        const txs = [];

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address || tx.toAddress === address) {
                    txs.push(tx);
                }
            }
        }

        return txs;
    }

    /**
     * Loops over all the blocks in the chain and verify if they are properly
     * linked together and nobody has tampered with the hashes. By checking
     * the blocks it also verifies the (signed) transactions inside of them.
     *
     * @returns {boolean}
     */
    isChainValid() {
        // Check if the Genesis block hasn't been tampered with by comparing
        // the output of createGenesisBlock with the first block on our chain
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        // Check the remaining blocks on the chain to see if there hashes and
        // signatures are correct
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];

            if (!currentBlock.hasValidRecords()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateRecordHash()) {
                return false;
            }
        }

        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Transaction = Transaction;