const Appointment = require('../models/appointment');
const User = require('../models/user');

exports.create = async(req, res, next) => {
    try {
        const appointmentData = new Appointment({
            title: req.body.title,
            start: req.body.start,
            backgroundColor: '#ff4081',
            borderColor: '#ff4081',
            textColor: '#fff',
            userId: req.body.users.id
        });
        let appointment = await appointmentData.save();
        if (!appointment) {
            throw new Error('Something went wrong. Cannot create new appointment!');
        }
        res.status(200).json({
            message: {
                ...appointment,
                id: appointment._id,
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
        const newAppointment = new Appointment({
            _id: req.body.appointmentId,
            status: req.body.status,
            backgroundColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
            borderColor: req.body.status === 1 ? '#3f51b5' : '#f44336',
        });
        let appointment = await Appointment.updateOne({ _id: req.body.appointmentId }, newAppointment).exec();
        if (!appointment) {
            throw new Error('Something went wrong. Cannot update appointment!');
        }

        res.status(200).json({ message: 'Update successful!' });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getAll = async(req, res, next) => {
    try {
        const pageSize = +req.query.pagesize;
        const currentPage = +req.query.page;
        const query = Appointment.find();

        if (pageSize && currentPage) {
            query.skip(pageSize * (currentPage - 1)).limit(pageSize);
        }

        let appointments = await query
        .populate('userId').exec();

        newAppointments = [];
        appointments.forEach(element => {

            var myObj = {
                _id: element._id,
                title: element.title,
                start: element.start,
                end: element.end,
                backgroundColor: element.backgroundColor,
                borderColor: element.borderColor,
                textColor: element.textColor,
                avatar: element.userId.avatar,
                fullname: element.userId.firstname + ' ' + element.userId.midlename + ', ' + element.userId.lastname,
                status: element.status
            };
            newAppointments.push(myObj);
        });

        let count = await Appointment.countDocuments({ 'licenseId': req.query.licenseId });

        res.status(200).json({
            message: 'Fetched successfully!',
            appointment: newAppointments,
            max: count
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getOne = async(req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.appointmentId).populate('userId').exec();
        res.status(200).json({
            appointmentId: appointment._id,
            title: appointment.title,
            start: appointment.start,
            end: appointment.end,
            status: appointment.status,
            avatar: appointment.userId.avatar,
            fullname: appointment.userId.firstname + ' ' + appointment.userId.midlename + ', ' + appointment.userId.lastname,
            gender: appointment.userId.gender,
            address: appointment.userId.address,
            birthdate: appointment.userId.birthdate,
            contact: appointment.userId.contact,
            detailId: appointment.userId._id
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.getNewAppointment = async(req, res, next) => {
    try {
        const pendingAppointment = await Appointment.aggregate([
          { $match: { 'status': 0 } },
          {
            $count: "pending"
          }
      ]);
      res.status(200).json({
          count: (pendingAppointment.length) ? pendingAppointment[0].pending : 0
      });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        appointmentIds = req.params.appointmentIds;
        appointmentId = appointmentIds.split(',');
        /**
         * delete person collection
         */
        let appointment = await Appointment.deleteMany({ _id: { $in: appointmentId } });
        if (!appointment) {
            throw new Error('Error in deleting appointment!');
        }
        res.status(200).json({
            message: appointment.deletedCount + ' item deleted successfull!'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
