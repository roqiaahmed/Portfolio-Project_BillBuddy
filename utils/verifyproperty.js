const Property = require('../models/property');
const Service = require('../models/Services');
const Task = require('../models/task');
const Action = require('../models/action');

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

const verifyTask = async (userId, taskId) => {
  const task = await Task.findById(taskId);
  const serviceId = await Service.findById(task.serviceId);
  const verifyservice = await verifyService(userId, serviceId);
  return verifyservice;
};

const verifyAction = async (userId, actionId) => {
  const action = await Action.findById(actionId);
  const taskId = await Task.findById(action.taskId);
  const verifytask = await verifyTask(userId, taskId);
  return verifytask;
};
module.exports = { verifyProperty, verifyService, verifyTask, verifyAction };
