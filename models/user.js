const mongoose = require('./../db/index');

const schema = mongoose.Schema({
    name: {
		firstname: { type: String, required: true },
		midlename: { type: String, default: null },
		lastname: { type: String, required: true }
    },
    publicKey: String,
    privateKey: String,
    gender: String,
    birthdate: { type: Date, default: null },
    contact: String,
    addresses: [{
        current: Boolean,
        address1: String, // street address
        address2: String, // street address line 2
        city: String,
        province: String,
        postalCode: Number,
        country: String
    }]
}, { timestamps: {} });

schema.virtual('fullName').get(() => {
    return this.firstname + ' ' + this.midlename + ' ' + this.lastname
})

schema.virtual('fullName').set((name) => {
    let str = name.split(' ')

    this.firstname = str[0]
    this.midlename = str[1]
    this.lastname = str[2]
})

module.exports = mongoose.model('Users', schema);