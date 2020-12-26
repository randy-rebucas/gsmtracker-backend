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
        const ownerId = req.query.ownerId;
        let data = await Customer.find()
            .populate('userId')
            .where('ownerId', ownerId)
            .sort({ '_id': 'asc' })
            .exec();
        res.status(200).json({
            message: 'Customer fetched successfully!',
            customers: data,
            counts: data.length
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        let data = await Customer.findOne({ _id: req.params.id }).populate('userId').exec();
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
        customerIds = req.query.customerIds.split(',');
        let customer = await Customer.deleteMany({ _id: { $in: customerIds } });
        if (!customer) {
            throw new Error('Error in deleting customer!');
        }
        res.status(200).json({
            message: customer.n + ' item deleted successfull!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.lookup = async(req, res, next) => {
    try {
        let customers = await Customer.find()
            .where('ownerId', req.params.id)
            .populate('userId');

        const result = [];
        customers.forEach(element => {
            result.push({ id: element._id, name: element.userId.name.firstname + ', ' + element.userId.name.lastname });
        });

        res.status(200).json({
            total: customers.length,
            results: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}