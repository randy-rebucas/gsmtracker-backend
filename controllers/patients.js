const Patient = require('../models/patient');

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
        res.status(200).json({
            message: ':: patient added ',
            patient: {
                ...data,
            }
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
        const query = Patient.find().populate('userId');
        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }
        let patients = await query.exec();
        let patientCount = await Patient.countDocuments();
        
        console.log(patients);
        res.status(200).json({
            message: 'Patient fetched successfully!',
            patients: patients,
            counts: patientCount
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
        // await Patient.deleteOne({ _id: req.params.id }).exec();
        let patient = await Patient.findByIdAndRemove(req.params.id).exec();
        if (!patient) {
            throw new Error('Something went wrong. Cannot be found id: ' + req.params.id);
        }
        const response = {
            message: "Patient successfully deleted",
            id: patient.userId
        };
        console.log(response);
        return res.status(200).send(response);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
