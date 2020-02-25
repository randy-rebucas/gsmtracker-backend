const Patient = require('../models/patient');

exports.defaultQuery = (pageSize, currentPage) => {
    const query = Patient.find().populate('userId');
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    
    return { 
        data: query.where('deleted', 0).sort({ 'userId.createdAt' : 'asc' }).exec(),
        count: Patient.countDocuments().where('deleted', 0)
    }
}

exports.filterQuery = (pageSize, currentPage, userId) => {
    const query = Patient.find({physicians: {$elemMatch: { "userId": userId}}}).populate('userId');
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    return {
        data: query.where('deleted', 0).sort({ 'userId.createdAt' : 'asc' }).exec(),
        count: Patient.countDocuments({physicians: {$elemMatch: { "userId": userId}}}).where('deleted', 0)
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

        let patients;
        let counts;
        if (!userId) {
            patients = await this.defaultQuery(pageSize, currentPage).data;
            counts = await this.defaultQuery(pageSize, currentPage).count;
        } else {
            patients = await this.filterQuery(pageSize, currentPage, userId).data;
            counts = await this.filterQuery(pageSize, currentPage, userId).count;
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

exports.delete = async(req, res, next) => {
    try {
        idArray = req.params.ids;
        ids = idArray.split(',');
        /**
         * soft delete patient collection
         */
        let patient = await Patient.updateMany({ _id: { $in: ids } }, { $set: { 'deleted': 1 } }, {'multi': true});
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
