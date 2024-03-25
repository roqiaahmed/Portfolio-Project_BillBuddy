const Property = require('../models/property');
const Service = require('../models/Services');

const verifyProperty = async (userId, propertyId) => {
  const property = await Property.findById(propertyId);
  if (property.userId.toString() !== userId) {
    return false;
  }
  return true;
};

const verifyService = async (userId, serviceId) => {
  const service = await Service.findById(serviceId);
  const propertyId = await Property.findById(service.propertyId).select('_id');
  const verifyproperty = await verifyProperty(userId, propertyId);
  return verifyproperty;
};

module.exports = { verifyProperty, verifyService };
