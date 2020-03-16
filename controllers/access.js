const Model = require('../models/access');

exports.create = async(req, res, next) => {
    try {
        // const model = new Model(req.body);
        // let data = await model.save();
        let blocks = req.body.blocks;
        
        blocks.forEach(async (block) => {
            let data = await Model.findOneAndUpdate({ blocks: { $elemMatch: { "blockId": block } } }).where({ physicianId: req.body.physicianId })
            let access = await Model.findOneAndUpdate(
                { physicianId: req.body.physicianId },
                {
                    $set: req.body
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        });

        // if (!data.length) {
        //     let block = await Model.findOneAndUpdate({ physicianId: userId }, {
        //         $push: {
        //             blocks: { blockId: blockId }
        //         }
        //     });
        //     if (!block) {
        //         throw new Error('Something went wrong.Cannot update block!');
        //     }
        // }

        res.status(200).json({
            message: 'Success'
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
            _id: req.body.typeId,
            name: req.body.name
        };

        let data = await Model.findOneAndUpdate(filter, update, { new: true });

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

exports.checkAccess = async(req, res, next) => {
    try {
        const blockId = req.query.blockId;
        const userId = req.query.userId;
        let data = await Model.findOne({ blocks: { $elemMatch: { "blockId": blockId } } }).where({ physicianId: userId }).where({ 'status': 'approve' })
            .sort({ '_id': 'asc' })
            .exec();

        res.status(200).json({
            physician: (data) ? data.physicianId : null,
            canAccess: (data) ? true : false
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getGrantPhysicians = async(req, res, next) => {
    try {
        const blockId = req.query.blockId;
        const patientId = req.query.patientId;
        const query = await Model.find({ blocks: { $elemMatch: { "blockId": blockId } } }).where({ status: 'approve' });
            
        if (patientId) {
            query.where({ patientId: patientId })
        }

        const data = query.sort({ '_id': 'asc' })
            .exec();

        console.log(data);
        res.status(200).json({
            physicians: data
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
