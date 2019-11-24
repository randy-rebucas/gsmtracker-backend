const Upload = require('../models/upload');

exports.create = async(req, res, next) => {
    try {

        let uploadCheck = await Upload.findOne({ sourceId: req.body.origId });

        const newUpload = new Upload({
            sourceId: req.body.origId,
            image: req.body.origImage
        });

        if (uploadCheck) {
            await Upload.updateOne({ sourceId: req.body.origId }, { '$set': { 'image': req.body.origImage } });
        } else{
            await newUpload.save();
        }

        res.status(200).json({
            imagePath: newUpload.image,
            message: 'image updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        const upload = await Upload.findOne({ sourceId: req.params.sourceId }).exec();
        res.status(200).json({
           image: upload.image
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};