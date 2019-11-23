const ObjectId = require('mongoose').Types.ObjectId;

const Message = require('../models/message');

exports.getAll = async(req, res, next) => {
    try {
        // const pageSize = +req.query.pagesize;
        // const currentPage = +req.query.page;
        // const query = User.find();
        // if (pageSize && currentPage) {
        //     query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        // }
        // let users = await query.exec();
        // let userCount = await User.countDocuments();

        // // console.log(users);
        // res.status(200).json({
        //     message: 'Users fetched successfully!',
        //     users: users,
        //     counts: userCount
        // });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        // const user = await User.findOne({ _id: new ObjectId(req.params.userId) }).exec();
        // res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        // userIds = req.params.userIds;
        // userId = Ids.split(',');

        // /**
        //  * delete auth credentials
        //  */
        // let auth = await Auth.deleteMany({ userId: { $in: userId } });
        // if (!auth) {
        //     throw new Error('Error in deleting auth!');
        // }
        // /**
        //  * delete person collection
        //  */
        // let user = await User.deleteMany({ _id: { $in: userId } });
        // if (!user) {
        //     throw new Error('Error in deleting person!');
        // }
        // res.status(200).json({
        //     message: user.deletedCount + ' item deleted successfull!'
        // });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.create = async(req, res, next) => {
    try {
        // /**
        //  * Set common entities on people collection
        //  */
        // const newUser = new User({
        //     pubkey: myKey.getPublic('hex'),
        //     prikey: myKey.getPrivate('hex'),
        //     firstname: req.body.firstname,
        //     lastname: req.body.lastname,
        //     midlename: req.body.midlename,
        //     gender: req.body.gender,
        //     age: req.body.age,
        //     birthdate: req.body.birthdate,
        //     status: req.body.status,
        //     contact: req.body.contact
        // });
        // addressData = req.body.address;
        // for (let index = 0; index < addressData.length; index++) {
        //     newUser.address.push(addressData[index]);
        // }
        // let user = await newUser.save();
        // if (!user) {
        //     throw new Error('Something went wrong.Cannot save user data!');
        // }
       
        // res.status(200).json({
        //     message: 'User added successfully',
        //     users: {
        //         ...user,
        //         id: user._id,
        //     }
        // });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.update = async(req, res, next) => {
    try {
        /**
         * Set common entities on people collection
         */
        // const newUser = new User({
        //     _id: req.params.userId,
        //     firstname: req.body.firstname,
        //     lastname: req.body.lastname,
        //     midlename: req.body.midlename,
        //     gender: req.body.gender,
        //     age: req.body.age,
        //     birthdate: req.body.birthdate,
        //     status: req.body.status,
        //     contact: req.body.contact,
        //     classification: req.body.classification
        // });
        // addressData = req.body.address;
        // for (let index = 0; index < addressData.length; index++) {
        //     newUser.address.push(addressData[index]);
        // }

        // let user = await User.findOneAndUpdate({ _id: req.params.userId }, newUser, { new: true });
        // if (!user) {
        //     throw new Error('Something went wrong.Cannot update user data!');
        // }
        // res.status(200).json({ message: user.firstname + ' Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};