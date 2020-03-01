const Setting = require('../models/setting');

exports.update = async(req, res, next) => {
    try {
        console.log(req.body);
        let settings = await Setting.findOneAndUpdate(
            { userId: req.params.userId },
            {
                $set: req.body
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

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
        let setting = await Setting.findOne({ userId: req.params.userId }).exec();
        res.status(200).json(setting);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};