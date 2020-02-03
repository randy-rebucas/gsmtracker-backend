const mongoose = require('./../db/index');

const userSchema = mongoose.Schema({
	name: {
		firstname: { type: String, required: true },
		midlename: String,
		lastname: { type: String, required: true }
	},
    gender: String,
    birthdate: Date,
    contact: String,
	isVerificafied: Boolean, 	// verified using there mobile
	isActivated: Boolean,		// activated for doctors
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

// userSchema.index({ name.firstname: 1, type: -1 }); // schema level

userSchema.virtual('fullName')
	.get(function() { return this.name.firstname + ' ' + this.name.lastname; })
	.set(function(v) {
		this.name.firstname = v.substr(0, v.indexOf(' '));
		this.name.lastname = v.substr(v.indexOf(' ') + 1);
	}
);

module.exports = mongoose.model('User', userSchema);