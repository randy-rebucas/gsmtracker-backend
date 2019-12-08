const mongoose = require('./../db/index');

const recordSchema = mongoose.Schema({
    recordType: String,
    recordOptions: [{
        isExpanded: { type: Boolean, default: false },
        isRemove: { type: Boolean, default: false }
    }]
});

const settingSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    general: [{
        owner: { type: String, required: true },
        practice: { type: String },
        name: { type: String, required: true },
        addresses: [{
            address1: { type: String }, // street address
            address2: { type: String }, // street address line 2
            city: { type: String },
            province: { type: String },
            postalCode: { type: Number },
            country: { type: String }
        }],
        email: { type: String },
        prc: { type: String },
        ptr: { type: String },
        s2: { type: String },
        nobreak: { type: Boolean },
        phones: [{
            contact: { type: String }
        }],
        hours: [{
            morningOpen: { type: String },
            afternoonClose: { type: String }
        }]
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
    }],
    records: [recordSchema]
});


module.exports = mongoose.model('Setting', settingSchema);