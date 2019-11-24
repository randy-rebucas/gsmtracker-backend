// const mongoose = require('mongoose');
const mongoose = require('./../db/index');

const userSchema = mongoose.Schema({
    publicKey: { type: String, require: true },
    privateKey: { type: String, require: true },
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true },
    gender: { type: String, default: null },
    birthdate: { type: Date, default: null },
    status: { type: String, default: null },
    contact: { type: String, default: null },
    address: [{
        address1: { type: String }, // street address
        address2: { type: String }, // street address line 2
        city: { type: String },
        province: { type: String },
        postalCode: { type: Number },
        country: { type: String }
    }],
    avatar: { type: String },
    usertypes: [{
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Type', required: true }
    }],
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

userSchema.virtual('age').get(() => {
    const today = new Date();
    const bDate = new Date(this.birthdate);
    let age = today.getFullYear() - bDate.getFullYear();
    const m = today.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
        age--;
    }
    return age;
})

module.exports = mongoose.model('User', userSchema);