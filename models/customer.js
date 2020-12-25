const mongoose = require('./../db/index');

const schema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
    description: String,
});

module.exports = mongoose.model('Customer', schema);