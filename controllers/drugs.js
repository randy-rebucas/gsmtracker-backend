const Drug = require('../models/drug');

exports.create = async(req, res, next) => {
    try {
        const drug = new Drug({
            genericName: req.body.genericName,
            categories: req.body.categoryId,
            strength: req.body.strength,
            dosage: req.body.dosage,
            quantity: req.body.quantity,
            brandName: req.body.brandName,
            supplier: req.body.supplierId,
            manufacturer: req.body.manufacturerId,
        });
        let data = await drug.save();
        res.status(200).json({
            message: ':: added ' + data.name
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const filter = { _id: req.params.id };
        const update = {
            _id: req.body.id,
            genericName: req.body.genericName,
            categories: req.body.categoryId,
            strength: req.body.strength,
            dosage: req.body.dosage,
            quantity: req.body.quantity,
            brandName: req.body.brandName,
            supplier: req.body.supplierId,
            manufacturer: req.body.manufacturerId,
        };

        let data = await Drug.findOneAndUpdate(filter, update, { new: true });

        if (!data) {
            throw new Error('Something went wrong.Cannot update data!');
        }
        res.status(200).json({
            message: 'type update successful!'
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        let data = await Drug.find()
            .sort({ '_id': 'asc' })
            .exec();

        res.status(200).json({
            data: data
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        let data = await Drug.findById(req.params.id).exec();
        if (!data) {
            throw new Error('Something went wrong. Cannot be found id: ' + req.params.id);
        }
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await Drug.deleteOne({ _id: req.params.id }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
