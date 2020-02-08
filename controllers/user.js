const bcrypt = require('bcryptjs');

const ObjectId = require('mongoose').Types.ObjectId;

const Auth = require('../models/auth');
const User = require('../models/user');
const Patient = require('../models/patient');

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

        res.status(200).json({
            message: 'Patient fetched successfully!',
            users: patients,
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
        const user = await User.findOne({ _id: new ObjectId(req.params.userId) }).exec();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
            /**
             * delete auth credentials
             */
        let auth = await Auth.deleteOne({ userId: req.params.userId});
        if (!auth) {
            throw new Error('Error in deleting auth!');
        }
        /**
         * delete person collection
         */
        let user = await User.deleteOne({ _id: req.params.userId });
        if (!user) {
            throw new Error('Error in deleting person!');
        }
        res.status(200).json({
            message: user.deletedCount + ' item deleted successfull!'
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.create = async(req, res, next) => {
    try {

        /**
         * check for existing email
         */
        let authCheck = await Auth.findOne({ email: req.body.email });
        if (authCheck) {
            throw new Error('Something went wrong. Email is in used!');
        }
        /**
         * Set common entities on people collection
         */
        const newUser = new User(req.body);
        newUser.publicKey = req.publicKey;
        newUser.privateKey = req.privateKey;
        
        let user = await newUser.save();
        if (!user) {
            throw new Error('Something went wrong.Cannot save user data!');
        }

        res.status(200).json({
            message: 'User added successfully',
            users: {
                ...user,
            },
            id: user._id
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.updatePhysicians = async(req, res, next) => {
    try {
        let physicians = await User.findOneAndUpdate(
            { _id: req.params.userId },
            {
                $push: {
                    physicians: { userId : req.body.physician }
                }
            }
        );
        if (!physicians) {
            throw new Error('Something went wrong.Cannot update Physicians!');
        }

        res.status(200).json({ message: 'Physicians updated successfully!' });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.update = async(req, res, next) => {
    try {
        /**
         * Set common entities on people collection
         */
        const newUser = new User(req.body);
        
        let user = await User.findOneAndUpdate({ _id: req.params.userId }, newUser, { new: true });
        if (!user) {
            throw new Error('Something went wrong.Cannot update user data!');
        }
        res.status(200).json({ message: user.firstname + ' Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

// ==================
exports.getNewUser = async(req, res, next) => {
    try {
        // const today = moment().startOf('day');
        // let userType = await Type.findOne({ slug: 'patients' }).exec();
        // let newPatientCount = await MyUser.countDocuments({
        //         'userType': userType._id
        //     })
        //     .populate({
        //         path: 'userId',
        //         populate: {
        //             path: 'personId',
        //             model: Person,
        //             match: {
        //                 createdAt: {
        //                     $gte: today.toDate(),
        //                     $lte: moment(today).endOf('day').toDate()
        //                 }
        //             },
        //         }
        //     })
        //     .exec()

        // res.status(200).json({
        //     count: newPatientCount
        // });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getTodaysBirthday = async(req, res, next) => {
    try {
        const birthdays = await User.aggregate([{
            "$redact": {
                "$cond": [{
                        "$eq": [
                            { "$month": "$birthdate" },
                            { "$month": new Date() }
                        ]
                    },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            }
        }]);

        res.status(200).json({
            users: birthdays
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
}

exports.search = async(req, res, next) => {
    try {
        //{ 'usertypes.type': userType._id }
        let userType = await User.findOne().exec();
        let users = await User.find();

        const result = [];
        users.forEach(element => {
            result.push({ id: element._id, name: element.name.firstname + ', ' + element.name.lastname });
        });

        let count = await User.countDocuments();

        res.status(200).json({
            total: count,
            results: result
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}