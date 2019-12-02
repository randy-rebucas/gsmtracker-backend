const SHA256 = require('crypto-js/sha256');

module.exports = (req, res, next) => {
    try {
        const difficulty = 4;
        const timestamp = Date.parse(new Date().toJSON().slice(0, 10));
        let previousHash = req.body.previousHash ? req.body.previousHash : '0';
        let nonce = req.body.nonce ? req.body.nonce : 0;

        while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            nonce++;
            req.hash = SHA256(JSON.stringify(req.body.transactions) + timestamp + previousHash + nonce).toString();
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unable to mined this record!' });
    }
}