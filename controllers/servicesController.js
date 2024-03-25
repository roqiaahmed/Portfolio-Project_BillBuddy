const Service = require('../models/Services');
const Task = require('../models/task');
const { uploadFiles, deleteFile } = require('../utils/uploadUtil');
const { StatusCodes } = require('http-status-codes');

const getAllServices = async (req, res) => {
  const propertyId = req.params.propertyId;
  const { name } = req.query;
  const queryObject = {
    propertyId,
  };
  if (name) {
    queryObject.name = { $regex: name };
  }

  const services = await Service.find(queryObject).sort({ name: 1 });
  res.status(StatusCodes.OK).json({ count: services.length, services });
};

const createService = async (req, res) => {
  const { name, details } = req.body;
  const newService = {
    propertyId: req.params.propertyId,
    name,
    details,
  };
  const files = await uploadFiles(req, res);
  if (files) {
    const images = files.map((url) => url);
    newService.images = images;
  }

  const service = await Service.create(newService);
  res.status(StatusCodes.CREATED).json({ service });
};

const getService = async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findOne({ _id: serviceId });
  if (!service) {
    return res.status(StatusCodes.NOT_FOUND).send('Service not found');
  }
  res.status(StatusCodes.OK).json({ service });
};

const updateService = async (req, res) => {
  const { serviceId } = req.params;
  const { name, details } = req.body;
  const oldService = await Service.findOne({ _id: serviceId });
  if (!oldService) {
    return res.status(StatusCodes.NOT_FOUND).send('Service not found');
  }
  const service = {
    name,
    details,
  };
  const path = name;
  const files = await uploadFiles(req, res, path);
  if (files) {
    const images = files.map((url) => url);
    service.images = images;
  }

  const updatedService = await Service.findByIdAndUpdate(serviceId, service, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ updatedService });
};

const deleteService = async (req, res) => {
  const { serviceId } = req.params;

  const service = await Service.findOne({
    _id: serviceId,
  });
  if (!service) {
    return res.status(StatusCodes.NOT_FOUND).send('Service not found');
  }
  const tasksCount = await Task.countDocuments({ serviceId });
  if (tasksCount > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Cannot delete service with associated tasks.' });
  }
  if (service.images && service.images.length > 0) {
    service.images.forEach(async (image) => {
      await deleteFile(image);
    });
  }
  await service.deleteOne({ _id: serviceId });
  res.status(StatusCodes.OK).json({ msg: 'Service deleted' });
};

module.exports = {
  getAllServices,
  createService,
  getService,
  updateService,
  deleteService,
};
