const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const nodeMailer = require('nodemailer');

const Auth = require('../models/auth');
const User = require('../models/user');
const Type = require('../models/type');
const Setting = require('../models/setting');

const Blockchain = require('../models/blockchain');

var _jade = require('jade');
var fs = require('fs');

const mail = require('./../helper/mailer');

exports.register = async(req, res, next) => {
    try {
        /**
         * Set new patients type doc in Type Collection
         */
        // const difficulty = 4;
        // const timestamp = Date.parse(new Date().toJSON().slice(0, 10));
        // let nonce = 0;

        // const transactions = {
        //     from: 'Polycode', //Providers public key
        //     to: 'Youtube', //patient public key
        //     message: `${req.privateKey} chained in block.`, // Provider added a record on Patient
        //     records: [
        //         { height: { value: 5 + 5, hasUnit: true, unit: 'cm' } },
        //         { weight: { value: 1 * 9, hasUnit: true, unit: 'kg' } },
        //         { temperature: { value: 34, hasUnit: true, unit: '°C' } }
        //     ]
        // };
   
        // const lastBlock = await Blockchain.findOne({}, null, { sort: { _id: -1 }, limit: 1 }).exec();
        // const previousHash = lastBlock ? lastBlock.hash : '0';
        // console.log('preveous hash: ' + previousHash);

        // let hash = SHA256(JSON.stringify(transactions) + timestamp + previousHash + nonce).toString();
        // console.log('first hash: ' + hash);

        // while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        //     nonce++;
        //     hash = SHA256(JSON.stringify(transactions) + timestamp + previousHash + nonce).toString();
        // }
        // console.log('nonce: '+ nonce);
        // console.log('new hash: ' + hash);

        // const newBlock = new Blockchain({
        //     timestamp: req.timestamp,
        //     transactions: req.transactions,
        //     previousHash: req.previousHash,
        //     hash: req.hash,
        //     nonce: req.nonce
        // });

        // let block = await newBlock.save();
        // console.log(block);
        /**
         * check for existing email
         */
        let authCheck = await Auth.findOne({ email: req.body.email });
        if (authCheck) {
            throw new Error('Something went wrong. Email is in used!');
        }
        /**
         * Set extended entities from poeple to users collection
         */
        const newUser = new User({
            publicKey: req.publicKey,
            privateKey: req.privateKey,
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        let user = await newUser.save();
        if (!user) {
            throw new Error('Something went wrong.Cannot save user!');
        }

        /**
         * Set physicians doc in type collection
         */
        const newType = new Type({
            name: 'Physicians',
            slug: slugify('Physicians', {
                replacement: '-', // replace spaces with replacement
                remove: null, // regex to remove characters
                lower: true, // result in lower case
            }),
            userID: user._id,
            description: 'a person qualified to practice medicine'
        });
        let type = await newType.save();
        if (!type) {
            throw new Error('Something went wrong.Cannot save user type collection!');
        }

        /**
         * update user type
         */

        let updatedUser = await User.updateOne({ _id: user._id }, { $set: { usertypes: type._id } });
        if (!updatedUser) {
            throw new Error('Something went wrong.Cannot update user type!');
        }
        /**
         * Set login credentials in auth collection
         */
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const authCredentials = new Auth({
            email: req.body.email,
            password: hash,
            userId: user._id
        });
        let auth = await authCredentials.save();
        if (!auth) {
            throw new Error('Something went wrong.Cannot save login credentials!');
        }

        /**
         * Set new patients type doc in Type Collection
         */
        const otherType = new Type({
            name: 'Patients',
            slug: slugify('Patients', {
                replacement: '-', // replace spaces with replacement
                remove: null, // regex to remove characters
                lower: true, // result in lower case
            }),
            userID: user._id,
            description: 'a person receiving or registered to receive medical treatment.'
        });
        await otherType.save();

        /**
         * Set new setting doc in Setting Collection
         */
        const newSetting = new Setting({
            userId: user._id
        });
        newSetting.general.push({
            name: req.body.name,
            owner: req.body.firstname + ' ' + req.body.lastname,
            email: req.body.email,
            practice: req.body.practice
        });
        await newSetting.save();

        // ==============
        const context = {
          email: req.body.email,
          password: req.body.password,
          site_name: 'cutsonwheel',
          site_origin: req.protocol + '://' + req.get('host')
        };
        await mail.sendMail(
          'welcome',
          context,
          'cutsonwheel <admin@cutsonwheel.com>',
          req.body.email,
          'New Account Registration'
        );

        res.status(200).json({
            message: 'Registered successfully!',
            user: user,
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.login = async(req, res, next) => {
    try {
        /**
         * Find email on auth collection
         */
        let auth = await Auth.findOne({ email: req.body.email });
        if (!auth) {
            throw new Error('Something went wrong. Your email is not listed!');
        }
        /**
         * compare password
         */
        let decrypted = await bcrypt.compare(req.body.password, auth.password);
        if (!decrypted) {
            throw new Error('Something went wrong. Incorrect password!');
        }

        let user = await User.findOne({ _id: auth.userId });

        let token = await jwt.sign({
                email: auth.email,
                userId: user._id
            },
            process.env.JWT_KEY, {}
        );

        res.status(200).json({
            token: token,
            userId: user._id,
            userEmail: auth.email
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}