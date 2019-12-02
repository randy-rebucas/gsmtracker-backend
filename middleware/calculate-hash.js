const SHA256 = require('crypto-js/sha256');

module.exports = (req, res, next) => {
    try {
        const timestamp = Date.parse(new Date().toJSON().slice(0, 10));
        let previousHash = req.body.previousHash ? req.body.previousHash : '0';
        let nonce = req.body.nonce ? req.body.nonce : 0;
        req.calculateHash = SHA256(JSON.stringify(req.body.transactions) + timestamp + previousHash + nonce).toString();
        req.timestamp = timestamp;
        next();
    } catch (error) {
        res.status(401).json({ message: 'error in calculating hash' });
    }
}