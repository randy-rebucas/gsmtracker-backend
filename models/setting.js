const mongoose = require('./../db/index');

const settingSchema = mongoose.Schema({
    userId: { type: String, require: true },
    logoPath: { type: String },
    owner: { type: String, required: true },
    name: { type: String, required: true  },
    addresses: [{
        address1: { type: String, required: true }, // street address
        address2: { type: String }, // street address line 2
        city: { type: String, required: true },
        province: { type: String, required: true },
        postalCode: { type: Number, required: true },
        country: { type: String, required: true }
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
});


module.exports = mongoose.model('Setting', settingSchema);
