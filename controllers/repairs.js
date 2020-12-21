const Repair = require('../models/repair');

exports.defaultQuery = (pageSize, currentPage, labelId) => {
    const query = Repair.find();// .populate('ownerId');

    if (labelId) {
        query.elemMatch('labels', function (elem) {
            elem.where({ labelId: labelId })
        })
    }
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    return {
        data: query.where('deleted', 0).sort({ 'createdAt': 'asc' }).exec(),
        count: Repair.countDocuments().where('deleted', 0)
    }
}

exports.filterQuery = (pageSize, currentPage, userId, labelId) => {
    const query = Repair.find({ owners: { $elemMatch: { "ownerId": userId } } });//.populate('userId');
    
    if (labelId) {
        query.elemMatch('labels', function (elem) {
            elem.where({ labelId: labelId })
        })
    }
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    return {
        data: query.where('deleted', 0).sort({ 'createdAt': 'asc' }).exec(),
        count: Repair.countDocuments({ owners: { $elemMatch: { "ownerId": userId } } }).where('deleted', 0)
    }
}

exports.create = async(req, res, next) => {
    try {
        console.log(req.body);
        const repair = new Repair(req.body);
        let data = await repair.save();
        console.log(data);
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

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const userId = req.query.userId;
        const labelId = req.query.labelId;
        
        let repairs;
        let counts;
        if (!userId) {
            repairs = await this.defaultQuery(pageSize, currentPage, labelId).data;
            counts = await this.defaultQuery(pageSize, currentPage, labelId).count;
        } else {
            repairs = await this.filterQuery(pageSize, currentPage, userId, labelId).data;
            counts = await this.filterQuery(pageSize, currentPage, userId, labelId).count;
        }
        res.status(200).json({
            message: 'Pepair fetched successfully!',
            repairs: repairs,
            counts: counts
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

exports.getOne = async(req, res, next) => {
    try {

        let data = await Repair.findById(req.params.id).populate('userId').exec();
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

exports.checkPhysician = async(req, res, next) => {
    try {
        let isExisting = await Repair.find({ physicians: { $elemMatch: { "userId": req.params.physicianId } } }).where('_id', req.params.patientId);
        if (!isExisting.length) {
            let physicians = await Repair.findOneAndUpdate({ _id: req.params.patientId }, {
                $push: {
                    physicians: { userId: req.params.physicianId }
                }
            });
            if (!physicians) {
                throw new Error('Something went wrong.Cannot update Physicians!');
            }
        }
        // return true;
        res.status(200).json({
            message: 'Physician added to network!',
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
            labels.push({labelId: label});
        });

        let label = await Repair.findOneAndUpdate(
            { _id: req.params.repairId },
            {
                $set: { 
                    'labels': labels 
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

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