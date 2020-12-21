const Technician = require('../models/technician');

exports.create = async(req, res, next) => {
    try {
        const technician = new Technician(req.body);
        let data = await technician.save();
        res.status(200).json({
            message: ':: technician added ',
            technicianId: data._id
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {

        let data = await Technician.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

        if (!data) {
            throw new Error('Something went wrong.Cannot update data!');
        }
        res.status(200).json(data);

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        let data = await Technician.find()
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
        let data = await Technician.findOne({ userId: req.params.id }).exec();
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
        await Technician.deleteOne({ _id: req.params.id }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};