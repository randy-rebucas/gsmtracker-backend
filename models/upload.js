const mongoose = require('./../db/index');

const uploadSchema = mongoose.Schema({
    sourceId: { type: String, require: true },
    image: String,
});


module.exports = mongoose.model('Upload', uploadSchema);
