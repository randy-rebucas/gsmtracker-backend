const Upload = require('../models/upload');

exports.create = async(req, res, next) => {
    try {
        
        let file = await Upload.findOneAndUpdate(
            { sourceId: req.body.origId },
            {
                $set: { 
                    'image': req.body.origImage 
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (!file) {
            throw new Error('Something went wrong.Cannot upload data!');
        }

        res.status(200).json({
            imagePath: file.image,
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
           image: upload ? upload.image : null
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};