const Property = require("../models/property");
const Service = require("../models/Services");

const getUserProperties = async (req, res) => {
  const { name } = req.query;
  const queryObject = {
    userId: req.userId,
  };
  if (name) {
    queryObject.name = { $regex: name };
  }
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const properties = await Property.find(queryObject).limit(limit).skip(skip);

    res.status(200).json({ count: properties.length, properties });
  } catch (error) {
    console.log({ error });
  }
};

const createProperty = async (req, res) => {
  try {
    const { name, info } = req.body;
    const newProperty = {
      name,
      info,
      userId: req.userId,
    };
    const property = await Property.create(newProperty);
    res.status(201).json({ msg: "created", property });
  } catch (error) {
    console.log({ error });
  }
};

const getProperty = async (req, res) => {
  const { propertyId } = req.params;
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404).send({ msg: `no property with this id ${propertyId}` });
  }
  res.status(200).json({ property });
};

const updateProperty = async (req, res) => {
  const { name, info } = req.body;
  const { propertyId } = req.params;
  if (name === "") {
    return res.status(400).json({ msg: "Please provide name" });
  }
  const property = await Property.findOneAndUpdate(
    { _id: propertyId },
    { name, info },
    { new: true }
  );
  if (!property) {
    res.status(404).send({ msg: `no property with this id ${propertyId}` });
  }
  res.status(200).json({ msg: "property updated successfully", property });
};

const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404).send({ msg: `no property with this id ${propertyId}` });
  }
  try {
    const servicesCount = await Service.countDocuments({ propertyId });
    if (servicesCount > 0) {
      res
        .status(400)
        .json({ msg: "Cannot delete property with associated services." });
    }

    await property.deleteOne();
    res.status(200).json({ msg: "property deleted successfully" });
  } catch (error) {
    console.log({ error });
  }
};

module.exports = {
  getUserProperties,
  createProperty,
  getProperty,
  updateProperty,
  deleteProperty,
};
