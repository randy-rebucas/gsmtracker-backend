const slugify = require('slugify');
const Plan = require('../models/plan');

exports.create = async(req, res, next) => {
    try {
        const newPlan = new Plan({
            name: req.body.name,
            slug: slugify(req.body.name, {
              replacement: '-', // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true, // result in lower case
            }),
            price: req.body.price,
            packages: req.body.packages
        });
        let plan = await newPlan.save();
        res.status(200).json({
            message: ':: added plan ' + plan.name
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
            _id: req.body.planId,
            name: req.body.name,
            slug: slugify(req.body.name, {
              replacement: '-', // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true, // result in lower case
            }),
            price: req.body.price,
            packages: req.body.packages
        };

        let plan = await Plan.findOneAndUpdate(filter, update, { new: true });
        // type.name;

        if (!plan) {
            throw new Error('Something went wrong.Cannot update plan!');
        }
        res.status(200).json({
            message: 'plan updated successfully!'
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        let plan = await Plan.find()
            .sort({ '_id': 'asc' })
            .exec();

        res.status(200).json({
            plans: plan
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let plan = await Plan.findById(req.params.planId).exec();
        if (!plan) {
            throw new Error('Something went wrong. Cannot be found type id: ' + req.params.planId);
        }
        res.status(200).json(plan);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getBySlug = async(req, res, next) => {
    try {
        let plan = await Plan.findOne({ slug: req.params.slug }).exec();
        if (!plan) {
            throw new Error('Something went wrong. Cannot be found plan slug: ' + req.params.slug);
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
        await Plan.deleteOne({ _id: req.params.planId }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
