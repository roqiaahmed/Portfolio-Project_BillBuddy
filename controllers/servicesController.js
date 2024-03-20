const Service = require("../models/Services");
const { uploadFiles, deleteFile } = require("../utils/uploadUtil");

const getServices = async (req, res) => {
  const propertyId = req.params.propertyId;
  try {
    const services = await Service.find({ propertyId });
    res.status(200).json({ count: services.length, services });
  } catch (error) {
    console.error("Error getting services:", error);
    res.status(500).send("Internal Server Error");
  }
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
  try {
    const service = await Service.create(newService);
    res.status(201).json({ service });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getService = async (req, res) => {
  const { propertyId, serviceId } = req.params;
  try {
    const service = await Service.findOne({ _id: serviceId, propertyId });
    if (!service) {
      return res.status(404).send("Service not found");
    }
    res.status(200).json({ service });
  } catch (error) {
    console.error("Error getting service:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateService = async (req, res) => {
  const { propertyId, serviceId } = req.params;
  const { name, details } = req.body;
  const oldService = await Service.findOne({ _id: serviceId, propertyId });
  if (!oldService) {
    return res.status(404).send("Service not found");
  }
  const service = {
    name,
    details,
  };
  const files = await uploadFiles(req, res);
  if (files) {
    const images = files.map((url) => url);
    service.images = images;
  }
  try {
    const updatedService = await Service.findByIdAndUpdate(serviceId, service, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteService = async (req, res) => {
  const { propertyId, serviceId } = req.params;
  try {
    const service = await Service.findOne({
      _id: serviceId,
      propertyId,
    });
    if (!service) {
      return res.status(404).send("Service not found");
    }
    if (service.images.length > 0) {
      service.images.forEach(async (image) => {
        console.log("Deleting image:", image, "\n");
        await deleteFile(image);
      });
    }
    await service.deleteOne({ _id: serviceId });
    res.status(200).json({ msg: "Service deleted" });
  } catch (error) {
    console.error("Error getting service:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getServices,
  createService,
  getService,
  updateService,
  deleteService,
};
