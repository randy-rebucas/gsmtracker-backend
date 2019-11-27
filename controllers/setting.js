const Setting = require('../models/setting');

exports.updateGeneral = async(req, res, next) => {
    try {
        const setting = new Setting({
            _id: req.body.id,
            userId: req.body.userId
        });

        let newAddress = [];
        let newContacts = [];
        let newHours = [];
        addressData = req.body.addresses;
        for (let index = 0; index < addressData.length; index++) {
            newAddress.push(addressData[index]);
        }
        phoneData = req.body.phones;
        for (let index = 0; index < phoneData.length; index++) {
            newContacts.push(phoneData[index]);
        }
        hourData = req.body.hours;
        for (let index = 0; index < hourData.length; index++) {
            newHours.push(hourData[index]);
        }

        setting.general.push({
            name: req.body.name,
            owner: req.body.owner,
            email: req.body.email,
            prc: req.body.prc,
            ptr: req.body.ptr,
            s2: req.body.s2,
            nobreak: req.body.nobreak,
            addresses: newAddress,
            phones: newContacts,
            hours: newHours
        });

        let settings = await Setting.updateOne({ _id: req.body.id }, setting).exec();
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
        const setting = new Setting({
            _id: req.body.id,
            userId: req.body.userId
        });

        setting.notification.push({
            deletedPatient: req.body.deletedPatient,
            createdAppointment: req.body.createdAppointment,
            cancelAppointment: req.body.cancelAppointment,
            sentMessage: req.body.sentMessage,
            newFeatures: req.body.newFeatures,
            newUpdates: req.body.newUpdates,
            subscriptionPlan: req.body.subscriptionPlan
        });

        let settings = await Setting.updateOne({ _id: req.body.id }, setting).exec();
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