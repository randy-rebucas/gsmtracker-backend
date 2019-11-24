const slugify = require('slugify');
const Type = require('../models/type');

exports.create = async(req, res, next) => {
    try {
        const typeData = new Type({
            name: req.body.name,
            slug: slugify(req.body.name, {
              replacement: '-', // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true, // result in lower case
            }),
            description: req.body.description,
            generated: 'Custom'
        });
        let type = await typeData.save();
        res.status(200).json({
            message: ':: added user type ' + type.name
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        const filter = { _id: req.params.typeId };
        const update = {
            _id: req.body.typeId,
            name: req.body.name,
            slug: slugify(req.body.name, {
              replacement: '-', // replace spaces with replacement
              remove: null, // regex to remove characters
              lower: true, // result in lower case
            }),
            description: req.body.description,
        };

        let type = await Type.findOneAndUpdate(filter, update, { new: true });
        // type.name;

        if (!type) {
            throw new Error('Something went wrong.Cannot update type!');
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
        let type = await Type.find()
            .sort({ '_id': 'asc' })
            .exec();

        res.status(200).json({
            types: type
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.get = async(req, res, next) => {
    try {
        let type = await Type.findById(req.params.typeId).exec();
        if (!type) {
            throw new Error('Something went wrong. Cannot be found type id: ' + req.params.typeId);
        }
        res.status(200).json(type);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getBySlug = async(req, res, next) => {
    try {
        let type = await Type.findOne({ slug: req.params.slug }).exec();
        if (!type) {
            throw new Error('Something went wrong. Cannot be found type id: ' + req.params.slug);
        }
        res.status(200).json(type);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await Type.deleteOne({ _id: req.params.typeId }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
