const mongoose = require('./../db/index');

const subscriptionSchema = mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String },
    packages: [{
        title: { type: String }
    }]
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
