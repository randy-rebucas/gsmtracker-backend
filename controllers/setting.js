const Setting = require('../models/setting');

exports.updateGeneral = async(req, res, next) => {
    try {

        let settings = await Setting.findOneAndUpdate(
            { _id: req.body.id },
            {
                $set: {
                    'general.0.name': req.body.name,
                    'general.0.owner': req.body.owner,
                    'general.0.email': req.body.email,
                    'general.0.prc': req.body.prc,
                    'general.0.ptr': req.body.ptr,
                    'general.0.s2': req.body.s2,
                    'general.0.nobreak': req.body.nobreak,
                    'general.0.addresses': req.body.addresses,
                    'general.0.phones': req.body.phones,
                    'general.0.hours': req.body.hours
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
                    'notification.0.deletedPatient': req.body.deletedPatient,
                    'notification.0.createdAppointment': req.body.createdAppointment,
                    'notification.0.cancelAppointment': req.body.cancelAppointment,
                    'notification.0.sentMessage': req.body.sentMessage,
                    'notification.0.newFeatures': req.body.newFeatures,
                    'notification.0.newUpdates': req.body.newUpdates,
                    'notification.0.subscriptionPlan': req.body.subscriptionPlan
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
                $set: {
                    subscription: req.body.subscription
                }
            }
        );

        if (!settings) {
            throw new Error('Something went wrong.Cannot update settings!');
        }

        res.status(200).json({ message: 'subscription settings update successful!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.getSetting = async(req, res, next) => {
    try {
        let setting = await Setting.findOne({ userId: req.params.userId }).exec();

        const clinicSettingId = (setting) ? setting._id : null;
        const clinicSettingGeneral = (setting) ? setting.general : null;
        const clinicSettingNotification = (setting) ? setting.notification : null;

        res.status(200).json({
            settingId: clinicSettingId,
            general: clinicSettingGeneral,
            notification: clinicSettingNotification
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};