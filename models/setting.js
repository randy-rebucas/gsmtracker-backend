const mongoose = require('./../db/index');

const settingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
<<<<<<< HEAD
    rxHeaderOption: { type: Boolean },
    rxFooterOption: { type: Boolean },
    prescription: {
        rxTitle: { type: String },
        rxSubTitle: { type: String },
        rxAddresses: [{
=======
    general: [{
        owner: { type: String, required: true },
        name: { type: String, required: true },
        addresses: [{
>>>>>>> e888c54b2cd05f8ced20c1323170487e42c6d829
            address1: { type: String }, // street address
            address2: { type: String }, // street address line 2
            city: { type: String },
            province: { type: String },
            postalCode: { type: Number },
            country: { type: String }
        }],
<<<<<<< HEAD
        rxNoNoonBreak: { type: Boolean },
        rxPhones: [{
=======
        email: { type: String },
        nobreak: { type: Boolean },
        phones: [{
>>>>>>> e888c54b2cd05f8ced20c1323170487e42c6d829
            contact: { type: String }
        }],
        rxHours: [{
            morningOpen: { type: String },
            afternoonClose: { type: String }
        }]
<<<<<<< HEAD
    },
    language: { type: String },
    appointments: { type: Boolean },
    updates: { type: Boolean }
=======
    }],
    notification: [{
        deletedPatient: Boolean,
        createdAppointment: Boolean,
        cancelAppointment: Boolean,
        sentMessage: Boolean,
        newFeatures: Boolean,
        newUpdates: Boolean,
        subscriptionPlan: Boolean
    }],
    subscription: [{
        plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', default: null },
        subscriptionDate: Date
    }]
>>>>>>> e888c54b2cd05f8ced20c1323170487e42c6d829
});


module.exports = mongoose.model('Setting', settingSchema);