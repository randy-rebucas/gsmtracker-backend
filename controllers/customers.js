const Customer = require('../models/customer');

exports.create = async(req, res, next) => {
    try {
        const customer = new Customer(req.body);
        let data = await customer.save();
        res.status(200).json({
            message: ':: customer added ',
            customerId: data._id
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {

        let data = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

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
        let data = await Customer.find()
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
        let data = await Customer.findOne({ userId: req.params.id }).exec();
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
        await Customer.deleteOne({ _id: req.params.id }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};