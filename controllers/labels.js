const Model = require('../models/label');

exports.create = async(req, res, next) => {
    try {
        const model = new Model(req.body);
        let data = await model.save();
        res.status(200).json({
            message: ':: added ' + data.label
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
            _id: req.params.id,
            label: req.body.label
        };

        let data = await Model.findOneAndUpdate(filter, update, { new: true });

        if (!data) {
            throw new Error('Something went wrong.Cannot update label!');
        }
        res.status(200).json({
            message: 'label update successful!'
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        let data = await Model.find()
            .sort({ '_id': 'asc' })
            .exec();

            res.status(200).json({
                message: 'label update successful!',
                labels: data
            });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        let data = await Model.findById(req.params.id).exec();
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
        await Model.deleteOne({ _id: req.params.id }).exec();

        res.status(200).json({ message: 'Deletion successfull!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
