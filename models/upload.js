const mongoose = require('./../db/index');

const uploadSchema = mongoose.Schema({
    userId: { type: String, require: true },
    name: { type: String },
    image: Buffer,
});


module.exports = mongoose.model('Upload', uploadSchema);
