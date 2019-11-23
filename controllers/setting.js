const Setting = require('../models/setting');

exports.create = async(req, res, next) => {
    try {
        const setting = new Setting({
            userId: req.body.userId,
            name: req.body.name,
            owner: req.body.owner,
            email: req.body.email,
            prc: req.body.prc,
            ptr: req.body.ptr,
            s2: req.body.s2,
            nobreak: req.body.nobreak
        });
        addressData = req.body.addresses;
        for (let index = 0; index < addressData.length; index++) {
            setting.addresses.push(addressData[index]);
        }
        phoneData = req.body.phones;
        for (let index = 0; index < phoneData.length; index++) {
            setting.phones.push(phoneData[index]);
        }
        hourData = req.body.hours;
        for (let index = 0; index < hourData.length; index++) {
            setting.hours.push(hourData[index]);
        }
        let settings = await setting.save();
        if (!settings) {
            throw new Error('Something went wrong.Cannot create settings!');
        }

        res.status(201).json({
            message: 'Setting added successfully',
            setting: {
                ...settings,
                id: settings._id,
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const setting = new Setting({
            _id: req.body.id,
            name: req.body.name,
            owner: req.body.owner,
            email: req.body.email,
            prc: req.body.prc,
            ptr: req.body.ptr,
            s2: req.body.s2,
            nobreak: req.body.nobreak
        });
        addressData = req.body.addresses;
        for (let index = 0; index < addressData.length; index++) {
            setting.addresses.push(addressData[index]);
        }
        phoneData = req.body.phones;
        for (let index = 0; index < phoneData.length; index++) {
            setting.phones.push(phoneData[index]);
        }
        hourData = req.body.hours;
        for (let index = 0; index < hourData.length; index++) {
            setting.hours.push(hourData[index]);
        }
        let settings = await Setting.updateOne({ _id: req.body.id }, setting).exec();
        if (!settings) {
            throw new Error('Something went wrong.Cannot update settings!');
        }

        res.status(200).json({ message: 'Settings update successful!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let setting = await Setting.findOne({ userId: req.params.userId}).exec();
        res.status(200).json(setting);

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

