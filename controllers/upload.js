const Upload = require('../models/upload');

exports.uploadLogo = async(req, res, next) => {
    try {
        // let clinicLogo = await sharp(req.file.path).resize(200, 200).toBuffer();
        // if (!clinicLogo) {
        //     throw new Error('Error in updating clinic logo!');
        // }
        // const newSetting = new Setting({
        //     _id: req.body.settingId,
        //     logoPath: `data:${req.file.mimetype};base64,${clinicLogo.toString('base64')}`
        // });
        // Buffer.from(req.file.myFile, 'base64')
        // let setting = await Setting.updateOne({ _id: req.params.settingId }, newSetting);
        // if (!setting) {
        //     throw new Error('Error in updating settings!');
        // }

        res.status(200).json({
            imagePath: newSetting.logoPath,
            message: 'Clinic logo updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
