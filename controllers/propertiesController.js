const Property = require("../models/property");
const Service = require("../models/Services");
const { StatusCodes } = require("http-status-codes");
const {
  UnauthenticatedError,
  BadRequestError,
  NotFoundError,
} = require("../errors/index");

const getUserProperties = async (req, res) => {
  const { name } = req.query;
  const queryObject = {
    userId: req.userId,
  };
  if (name) {
    queryObject.name = { $regex: name };
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const properties = await Property.find(queryObject).limit(limit).skip(skip);

  res.status(StatusCodes.OK).json({ count: properties.length, properties });
};

const createProperty = async (req, res) => {
  const { name, info } = req.body;
  const newProperty = {
    name,
    info,
    userId: req.userId,
  };
  const property = await Property.create(newProperty);
  res.status(201).json({ msg: "created", property });
};

const getProperty = async (req, res) => {
  const { propertyId } = req.params;
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new BadRequestError(`no property with this id ${propertyId}`);
  }
  if (property.userId.toString() !== req.userId) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
  res.status(StatusCodes.OK).json({ property });
};

const updateProperty = async (req, res) => {
  const { name, info } = req.body;
  const { propertyId } = req.params;
  let property = await Property.findById(propertyId);

  if (!property) {
    throw new NotFoundError(`no property with this id ${propertyId}`);
  }

  if (property.userId.toString() !== req.userId) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  if (name === "") {
    throw new BadRequestError("Please provide name");
  }

  property = await Property.findOneAndUpdate(
    { _id: propertyId },
    { name, info },
    { new: true }
  );
  res
    .status(StatusCodes.OK)
    .json({ msg: "property updated successfully", property });
};

const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  const property = await Property.findById(propertyId);
  if (!property) {
    throw new NotFoundError(`no property with this id ${propertyId}`);
  }

  if (property.userId.toString() !== req.userId) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const servicesCount = await Service.countDocuments({ propertyId });
  if (servicesCount > 0) {
    throw new BadRequestError(
      "Cannot delete property with associated services."
    );
  }
  await property.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "property deleted successfully" });
};

module.exports = {
  getUserProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
};
