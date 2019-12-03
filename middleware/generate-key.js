const EC = require('elliptic').ec;

module.exports = (req, res, next) => {
    try {
        // Generate keys...
        const ec = new EC('secp256k1');
        const key = ec.genKeyPair();
        req.publicKey = key.getPublic('hex');
        req.privateKey = key.getPrivate('hex');
        next();
    } catch (error) {
        res.status(401).json({ message: 'error in generating key pairs' });
    }
}