const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/auth');
const User = require('../models/user');
const Owner = require('../models//owner');

const mail = require('./../helper/mailer');

exports.register = async(req, res, next) => {
    try {
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
            name: {
                firstname: req.body.firstname,
                lastname: req.body.lastname
            },
            publicKey: req.publicKey,
            privateKey: req.privateKey
        });
        let user = await newUser.save();

        if (!user) {
            throw new Error('Something went wrong.Cannot save user!');
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

        const newOwner = new Owner({
            userId: user._id,
            description: 'a person own a shop.'
        });
        let owner = await newOwner.save();
        if (!owner) {
            throw new Error('Something went wrong.Cannot save owner data!');
        }

        // const context = {
        //     email: req.body.email,
        //     password: req.body.password,
        //     site_name: 'cutsonwheel',
        //     site_origin: req.protocol + '://' + req.get('host')
        // };
        // await mail.sendMail(
        //     'welcome',
        //     context,
        //     'cutsonwheel <admin@cutsonwheel.com>',
        //     req.body.email,
        //     'New Account Registration'
        // );

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

exports.update = async(req, res, next) => {
    try {
        /**
         * Find email on auth collection
         */
        let auth = await Auth.findOne({ email: req.body.email });
        /**
         * compare password
         */
        let decrypted = await bcrypt.compare(req.body.oldPass, auth.password);
        if (!decrypted) {
            throw new Error('Something went wrong. entered password does not match old password!');
        }
        let update;
        if (req.body.targetField != 'email') {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.newPass, salt);

            update = {
                _id: auth._id,
                password: hash
            };
        } else {
            let checkEmail = await Auth.findOne({ email: req.body.newEmail });
            if (checkEmail) {
                throw new Error('Something went wrong. Email is in used!');
            }

            update = {
                _id: auth._id,
                email: req.body.newEmail
            };
        }
        

        let data = await Auth.findOneAndUpdate({ _id: auth._id }, update, { new: true });
        if (!data) {
            throw new Error('Something went wrong. Failed to update password!');
        }

        res.status(200).json({
            message: 'Password changed successfully!',
            state: true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
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
        // U2oq0FxEq
        let user = await Owner.findOne({ userId: auth.userId }).populate('userId').exec();   
        if (!user) {
            throw new Error('Something went wrong. Cannot find email: ' + req.body.email + ' list!');
        }
        let token = await jwt.sign({
                email: auth.email,
                userId: user.userId._id,
                publicKey: user.userId.publicKey
            },
            process.env.JWT_KEY, {}
        );

        res.status(200).json({
            token: token,
            userEmail: auth.email,
            userId: user.userId._id,
            publicKey: user.userId.publicKey
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getOne = async(req, res, next) => {
    try {

        let data = await Auth.findOne({userId: req.params.id}).exec();

        res.status(200).json({
            auth: data,
            status: (!data) ? false : true
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.generate = async(req, res, next) => {
    try {
        /**
         * check for existing email
         */
        let authCheck = await Auth.findOne({ email: req.body.email });
        if (authCheck) {
            throw new Error('Something went wrong. Email is in used!');
        }

        let patient = await Patient.findById(req.body.id);
        /**
         * Set login credentials in auth collection
         */
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        const authCredentials = new Auth({
            email: req.body.email,
            password: hash,
            userId: patient.userId
        });
        let auth = await authCredentials.save();
        if (!auth) {
            throw new Error('Something went wrong.Cannot save login credentials!');
        }

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
            'Auth credential generated'
        );

        res.status(200).json({
            message: 'Generates successfully!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}