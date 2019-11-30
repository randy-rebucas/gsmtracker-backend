const Setting = require('../models/setting');

exports.updateGeneral = async(req, res, next) => {
    try {

        let settings = await Setting.findOneAndUpdate(
            { _id: req.body.id },
            {
                $set: {
                    general: {
                        name: req.body.name,
                        owner: req.body.owner,
                        email: req.body.email,
                        prc: req.body.prc,
                        ptr: req.body.ptr,
                        s2: req.body.s2,
                        nobreak: req.body.nobreak,
                        addresses: req.body.addresses,
                        phones: req.body.phones,
                        hours: req.body.hours,
                    }
                }
            }
        );

        if (!settings) {
            throw new Error('Something went wrong.Cannot update settings!');
        }

        res.status(200).json({ message: 'General settings update successful!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.updateNotification = async(req, res, next) => {
    try {

        let settings = await Setting.findOneAndUpdate(
            { _id: req.body.id },
            {
                $set: {
                    notification: {
                        deletedPatient: req.body.deletedPatient,
                        createdAppointment: req.body.createdAppointment,
                        cancelAppointment: req.body.cancelAppointment,
                        sentMessage: req.body.sentMessage,
                        newFeatures: req.body.newFeatures,
                        newUpdates: req.body.newUpdates,
                        subscriptionPlan: req.body.subscriptionPlan
                    }
                }
            }
        );

        if (!settings) {
            throw new Error('Something went wrong.Cannot update settings!');
        }

        res.status(200).json({ message: 'notification settings update successful!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.updateSubscription = async(req, res, next) => {
    try {

        let settings = await Setting.findOneAndUpdate(
            { _id: req.body.id },
            {
                // push to add new record of subscription
                $set: {
                    subscription: {
                        plan: req.body.subscription,
                        subscriptionDate: req.body.subscriptionDate
                    }
                }
            }
        );

        if (!settings) {
            throw new Error('Something went wrong.Cannot update settings!');
        }

        res.status(200).json({ message: 'subscription update successful!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.get = async(req, res, next) => {
    try {
        let setting = await Setting.findOne({ userId: req.params.userId }).exec();
        res.status(200).json({
            settings: setting
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getSetting = async(req, res, next) => {
    try {
        let setting = await Setting.findOne({ userId: req.params.userId }).exec();

        const clinicSettingId = (setting) ? setting._id : null;
        const clinicSettingGeneral = (setting) ? setting.general : null;
        const clinicSettingNotification = (setting) ? setting.notification : null;
        const clinicSettingSubscription = (setting) ? setting.subscription : null;

        res.status(200).json({
            settingId: clinicSettingId,
            general: clinicSettingGeneral,
            notification: clinicSettingNotification,
            subscription: clinicSettingSubscription
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};