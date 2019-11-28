const slugify = require('slugify');
const Subscription = require('../models/subscription');

exports.create = async(req, res, next) => {
    try {
        const newSubscription = new Subscription({
            name: req.body.name,
            slug: slugify(req.body.name, {
              replacement: '-', // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true, // result in lower case
            }),
            packages: req.body.packages
        });
        let subscription = await newSubscription.save();
        res.status(200).json({
            message: ':: added subscription ' + subscription.name
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const filter = { _id: req.params.subscriptionId };
        const update = {
            _id: req.body.subscriptionId,
            name: req.body.name,
            slug: slugify(req.body.name, {
              replacement: '-', // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true, // result in lower case
            }),
            packages: req.body.packages
        };

        let subscription = await Subscription.findOneAndUpdate(filter, update, { new: true });
        // type.name;

        if (!subscription) {
            throw new Error('Something went wrong.Cannot update subscription!');
        }
        res.status(200).json({
            message: 'subscription updated successfully!'
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        let subscription = await Subscription.find()
            .sort({ '_id': 'asc' })
            .exec();

        res.status(200).json({
            plans: subscription
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let subscription = await Subscription.findById(req.params.subscriptionId).exec();
        if (!subscription) {
            throw new Error('Something went wrong. Cannot be found type id: ' + req.params.subscriptionId);
        }
        res.status(200).json(subscription);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getBySlug = async(req, res, next) => {
    try {
        let subscription = await Subscription.findOne({ slug: req.params.slug }).exec();
        if (!subscription) {
            throw new Error('Something went wrong. Cannot be found subscription slug: ' + req.params.slug);
        }
        res.status(200).json(subscription);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await Subscription.deleteOne({ _id: req.params.subscritpionId }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
