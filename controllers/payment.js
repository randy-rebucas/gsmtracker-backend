const slugify = require('slugify');
const Payment = require('../models/payment');

exports.create = async(req, res, next) => {
    try {
        const newPayment = new Payment({
            paymentId: req.body.paymentId,
            transactionId: req.body.transactionId,
            payerId: req.body.payerId,
            invoiceId: req.body.invoiceId,
            amount: req.body.amount
        });
        let payment = await newPayment.save();
        res.status(200).json({
            message: ':: added payment ' + payment.invoiceId
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const filter = { _id: req.params.planId };
        const update = {
            _id: req.body.paymentId,
            amount: req.body.amount,
            status: req.body.status
        };

        let payment = await Payment.findOneAndUpdate(filter, update, { new: true });
        // type.name;

        if (!payment) {
            throw new Error('Something went wrong.Cannot update payment!');
        }
        res.status(200).json({
            message: 'payment updated successfully!'
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        let payment = await Payment.find()
            .sort({ '_id': 'asc' })
            .exec();

        res.status(200).json({
            payments: payment
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let payment = await Payment.findById(req.params.paymentId).exec();
        if (!payment) {
            throw new Error('Something went wrong. Cannot be found payment id: ' + req.params.paymentId);
        }
        res.status(200).json(plan);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await Payment.deleteOne({ _id: req.params.paymentId }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
