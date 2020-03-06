const Patient = require('../models/patient');
const User = require('../models/user');

exports.defaultQuery = (pageSize, currentPage, labelId) => {
    const query = Patient.find().populate('userId');

    if (labelId) {
        query.elemMatch('labels', function (elem) {
            elem.where({ labelId: labelId })
        })
    }
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    return {
        data: query.where('deleted', 0).sort({ 'userId.createdAt': 'asc' }).exec(),
        count: Patient.countDocuments().where('deleted', 0)
    }
}

exports.filterQuery = (pageSize, currentPage, userId, labelId) => {
    const query = Patient.find({ physicians: { $elemMatch: { "userId": userId } } }).populate('userId');
    
    if (labelId) {
        query.elemMatch('labels', function (elem) {
            elem.where({ labelId: labelId })
        })
    }
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    return {
        data: query.where('deleted', 0).sort({ 'userId.createdAt': 'asc' }).exec(),
        count: Patient.countDocuments({ physicians: { $elemMatch: { "userId": userId } } }).where('deleted', 0)
    }
}

exports.create = async(req, res, next) => {
    try {
        const patient = new Patient({
            userId: req.body.userId,
            description: 'a person receiving or registered to receive medical treatment.',
            physicians: [{
                userId: req.body.physician
            }]
        });
        let data = await patient.save();
        console.log(data._id);
        res.status(200).json({
            message: ':: patient added ',
            patientId: data._id
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
            _id: req.body.id,
            description: req.body.description
        };

        let data = await Patient.findOneAndUpdate(filter, update, { new: true });

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

        let patients;
        let counts;
        if (!userId) {
            patients = await this.defaultQuery(pageSize, currentPage, labelId).data;
            counts = await this.defaultQuery(pageSize, currentPage, labelId).count;
        } else {
            patients = await this.filterQuery(pageSize, currentPage, userId, labelId).data;
            counts = await this.filterQuery(pageSize, currentPage, userId, labelId).count;
        }

        res.status(200).json({
            message: 'Patient fetched successfully!',
            patients: patients,
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

        let data = await Patient.findById(req.params.id).populate('userId').exec();
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
        let isExisting = await Patient.find({ physicians: { $elemMatch: { "userId": req.params.physicianId } } }).where('_id', req.params.patientId);
        if (!isExisting.length) {
            let physicians = await Patient.findOneAndUpdate({ _id: req.params.patientId }, {
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

        let label = await Patient.findOneAndUpdate(
            { _id: req.params.patientId },
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

exports.getByKey = async(req, res, next) => {
    try {
        let user = await User.findOne({ publicKey: req.params.publicKey });
        if (!user) {
            throw new Error('Something went wrong. Cannot find block key: ' + req.params.publicKey);
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.delete = async(req, res, next) => {
    try {
        idArray = req.params.ids;
        ids = idArray.split(',');
        /**
         * soft delete patient collection
         */
        let patient = await Patient.updateMany({ _id: { $in: ids } }, { $set: { 'deleted': 1 } }, { 'multi': true });
        if (!patient) {
            throw new Error('Error in deleting patient!');
        }
        res.status(200).json({
            message: patient.n + ' item deleted successfull!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};