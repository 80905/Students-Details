const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/usersModel');
const Email = require('../utils/email');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    // const users = await User.find();
    // const url = `${req.protocol}://${req.get('host')}`;
    // await Promise.all(
    //   users.forEach(async (user) => {
    //     await new Email(user, url).sendNotification();
    //   })
    // );

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let ids = req.params.id.split(',');

    const doc = await Promise.all(ids.map(async (id) => await Model.findByIdAndDelete({ _id: id })));
    //const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found on this id!!`, 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`${Model.modelName} doc not found on this id!!`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.studentId) filter = { school: req.params.studentId };

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    //EXECUTE QUERY
    const doc = await features.query;
    // let query = Model.find(req.query);

    // //SORTing data
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('createdAt');
    // }

    // //SELECTing data
    // if (req.query.select) {
    //   const selectBy = req.query.select.split(',').join(' ');
    //   query = query.select(selectBy);
    // } else {
    //   query = query.select('-__v');
    // }

    // // Adding PAGination
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);

    //const doc = await query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);

    if (populateOpt) query = query.populate(populateOpt);

    const doc = await query;

    if (!doc) {
      return next(new AppError(`${Model.modelName} not found on this id!!`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
