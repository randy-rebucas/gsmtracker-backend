const mongoose = require('./../db/index');

const settingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clinicname: { type: String },
    clinicowner: { type: String },
    rxHeaderOption: { type: Boolean },
    rxFooterOption: { type: Boolean },
    prescription: {
        rxTitle: { type: String },
        rxSubTitle: { type: String },
        rxAddresses: [{
            address1: { type: String }, // street address
            address2: { type: String }, // street address line 2
            city: { type: String },
            province: { type: String },
            postalCode: { type: Number },
            country: { type: String }
        }],
        rxNoNoonBreak: { type: Boolean },
        rxPhones: [{
            contact: { type: String }
        }],
        rxHours: [{
            morningOpen: { type: String },
            afternoonClose: { type: String }
        }]
    },
    language: { type: String },
    appointments: { type: Boolean },
    updates: { type: Boolean }
});


module.exports = mongoose.model('Setting', settingSchema);