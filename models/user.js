const mongoose = require('./../db/index');

const userSchema = mongoose.Schema({
    publicKey: { type: String, require: true },
    privateKey: { type: String, require: true },
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true },
    gender: { type: String, default: null },
    birthdate: { type: Date, default: null },
    contact: { type: String, default: null },
    address: [{
        current: { type: Boolean },
        address1: { type: String }, // street address
        address2: { type: String }, // street address line 2
        city: { type: String },
        province: { type: String },
        postalCode: { type: Number },
        country: { type: String }
    }],
    metas: [{
        label: { type: String },
        value: { type: String }
    }],
    usertypes: { type: mongoose.Schema.Types.ObjectId, ref: 'Type' },
    physicians: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }]
}, { timestamps: {} });

userSchema.virtual('fullName').get(() => {
    return this.firstname + ' ' + this.lastname
})

userSchema.virtual('fullName').set((name) => {
    let str = name.split(' ')

    this.firstname = str[0]
    this.lastname = str[1]
})

module.exports = mongoose.model('User', userSchema);