const Queing = require('../models/queing');

exports.create = async(req, res, next) => {
    try {
        let count = 0;
        let queCheck = await Queing.findOne({ userId: req.body.patientId })
          .populate('userId')
          .exec();

        if (queCheck) {
          throw new Error('Something went wrong.' + queCheck.userId.firstname + ' ' + queCheck.userId.lastname + ' already on que!');
        }

        count = await Queing.countDocuments();

        const queData = new Queing({
            queNumber: '00' + (count + 1),
            userId: req.body.patientId
        });
        let que = await queData.save();

        res.status(201).json({
            que: {
                queNumber: que.queNumber,
                id: que._id,
            }
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {

        const que = await Queing.find()
            .populate('userId')
            .sort({ 'queNumber': 'asc' })
            .exec();

        newQueings = [];
        que.forEach(element => {
            var myObj = {
                id: element._id,
                queNum: element.queNumber,
                fullname: element.userId.firstname + ' ' + element.userId.lastname,
                userId: element.userId
            };
            newQueings.push(myObj);
        });

        res.status(200).json({
            ques: newQueings
        });

    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.checkOnQue = async(req, res, next) => {
  try {
    let que = await Queing.findOne({ userId: req.params.patientId }).exec();
    res.status(200).json({
      onQue: que ? true : false
    });

  } catch (error) {
    res.status(500).json({
        message: error.message
    });
  }
};

exports.delete = async(req, res, next) => {
    try {
        await Queing.deleteOne({ _id: req.params.queingId }).exec();
        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.deleteAll = async(req, res, next) => {
    try {
        await Queing.deleteMany().exec();
        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.deleteSmooth = async(req, res, next) => {
    try {
        await Queing.deleteOne({ userId: req.params.patientId }).exec();
        res.status(200).json({
            message: 'Deletion successfull!'
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.deleteCanceled = async(req, res, next) => {
  try {
      await Queing.deleteOne({ userId: req.params.patientId }).exec();
      res.status(200).json({
          message: 'Deletion successfull!'
      });
  } catch (e) {
      res.status(500).json({
          message: e.message
      });
  }
};

exports.getNext = async(req, res, next) => {

    try {
        let nextQue = await Queing.findOne().populate('userId').sort({ created: -1 }).exec();
        if (!nextQue) {
            throw new Error('Something went wrong.!');
        }
        res.status(200).json({
            _id: nextQue._id,
            personId: nextQue.myUserId
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
