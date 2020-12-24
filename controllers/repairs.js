const Repair = require('../models/repair');

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const userId = req.query.userId;
        const labelId = req.query.labelId;
        const query = Repair.find()
            .populate({
                path: 'customerId',
                populate: {
                    path: 'userId'
                }
            })
            .populate({
                path: 'technicianId',
                populate: {
                    path: 'userId'
                }
            });
        if (labelId) {
            query.elemMatch('labels', function(elem) {
                elem.where({ labelId: labelId })
            })
        }
        if (userId) {
            query.elemMatch('owners', function(elem) {
                elem.where({ ownerId: userId })
            })
        }
        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        const repairs = await query.where('deleted', 0).sort({ 'createdAt': 'asc' }).exec();

        res.status(200).json({
            message: 'Repair fetched successfully!',
            repairs: repairs,
            counts: repairs.length
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.create = async(req, res, next) => {
    try {
        const repair = new Repair(req.body);
        let data = await repair.save();
        res.status(200).json({
            message: ':: repair added ',
            repairId: data._id
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
        let data = await Repair.findOneAndUpdate(filter, req.body, { new: true });

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

exports.getOne = async(req, res, next) => {
    try {

        let data = await Repair.findById(req.params.id).populate({
            path: 'customerId',
            populate: {
                path: 'userId'
            }
        }).exec();
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

exports.checkOwner = async(req, res, next) => {
    try {
        let isExisting = await Repair.find({ owners: { $elemMatch: { "ownerId": req.params.ownerId } } }).where('_id', req.params.repairId);
        if (!isExisting.length) {
            let owners = await Repair.findOneAndUpdate({ _id: req.params.repairId }, {
                $push: {
                    owners: { ownerId: req.params.ownerId }
                }
            });
            if (!owners) {
                throw new Error('Something went wrong.Cannot update Owners!');
            }
        }
        // return true;
        res.status(200).json({
            message: 'Owner added!',
            existing: (!isExisting.length) ? false : true
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.setLabel = async(req, res, next) => {
    try {
        const labels = [];
        const paramLabel = req.params.labels.split(',');
        paramLabel.forEach(label => {
            labels.push({ labelId: label });
        });

        let label = await Repair.findOneAndUpdate({ _id: req.params.repairId }, {
            $set: {
                'labels': labels
            }
        }, { upsert: true, new: true, setDefaultsOnInsert: true });

        if (!label) {
            throw new Error('Something went wrong.Cannot set label!');
        }

        res.status(200).json({
            message: 'label set updated!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        idArray = req.params.ids;
        ids = idArray.split(',');
        /**
         * soft delete pepair collection
         */
        let repair = await Repair.updateMany({ _id: { $in: ids } }, { $set: { 'deleted': 1 } }, { 'multi': true });
        if (!repair) {
            throw new Error('Error in deleting repair!');
        }
        res.status(200).json({
            message: repair.n + ' item deleted successfull!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};