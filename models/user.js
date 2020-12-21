const mongoose = require('./../db/index');

const addressSchema = mongoose.Schema({
    current: Boolean,
    address1: String, // street address
    address2: String, // street address line 2
    city: String,
    province: String,
    postalCode: Number,
    country: String
});

const nameSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    midlename: { type: String, default: null },
    lastname: { type: String, required: true }
});

const schema = mongoose.Schema({
    name: nameSchema,
    gender: String,
    birthdate: { type: Date, default: null },
    contact: String,
    addresses: [addressSchema]
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