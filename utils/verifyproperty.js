const Property = require("../models/property");

const verifyProperty = async (userId, propertyId) => {
  const property = await Property.findById(propertyId);
  if (property.userId.toString() !== userId) {
    return false;
  }
  return true;
};

module.exports = verifyProperty;
