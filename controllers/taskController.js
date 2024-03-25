const Task = require('../models/task');
const Service = require('../models/Services');
const Action = require('../models/action');
const cron = require('node-cron');
const { sendNotification } = require('../utils/notificationService');
const { StatusCodes } = require('http-status-codes');

const getAllTasks = async (req, res) => {
  const { serviceId } = req.params;
  const { name, reminde } = req.query;
  let queryObject = {
    serviceId,
  };
  if (name) {
    queryObject.name = { $regex: name };
  }
  if (reminde) {
    queryObject.reminde = reminde;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(queryObject)
    .sort('reminderDay')
    .limit(limit)
    .skip(skip);

  res.status(StatusCodes.OK).json({ count: tasks.length, tasks });
};

// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

const createTask = async (req, res) => {
  const { serviceId } = req.params;

  const { name } = req.body;
  const service = await Service.findOne({ _id: serviceId });
  const serviceName = service.name;
  const reminde = req.body.reminde === undefined ? true : req.body.reminde;
  const reminderDay = req.body.reminderDay || 1;
  let job = null;
  if (reminde) {
    job = cron.schedule(`*/${reminderDay} * * * *`, () => {
      sendNotification(req.userId, `${serviceName} - ${name}`);
    });
    job.start();
  }
  const newTask = await Task.create({
    serviceId,
    name,
    reminde,
    reminderDay,
    jobId: job ? job.options.name : null,
  });
  res.send({ newTask });
};
const getTask = async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId });
  if (!task) {
    return res.status(StatusCodes.NOT_FOUND).send('Task not found');
  }
  res.status(StatusCodes.OK).json({ task });
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { name } = req.body;
  const oldTask = await Task.findOne({ _id: taskId });
  if (!oldTask) {
    return res.status(StatusCodes.NOT_FOUND).send('Task not found');
  }
  const service = await Service.findOne({ _id: oldTask.serviceId });
  const serviceName = service.name;
  const reminderDay = req.body.reminderDay || oldTask.reminderDay;
  const reminde = req.body.reminde === undefined ? true : req.body.reminde;
  const task = {
    name,
    reminde,
    reminderDay,
    jobId: oldTask.jobId,
  };
  if (reminde) {
    const job = cron.schedule(`*/${reminderDay} * * * *`, () => {
      sendNotification(req.userId, `${serviceName} - ${name}`);
    });
    if (oldTask.jobId) {
      cron.getTasks().forEach((task) => {
        if (task.options.name === oldTask.jobId) {
          task.stop();
        }
      });
    }
    job.start();
    task.jobId = job.options.name;
  } else {
    cron.getTasks().forEach((task) => {
      if (task.options.name === oldTask.jobId) {
        task.stop();
      }
    });
  }
  const updated = await Task.findOneAndUpdate({ _id: taskId }, task, {
    new: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: 'task updated successfully', task: updated });
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const oldTask = await Task.findOne({ _id: taskId });
  if (!oldTask) {
    return res.status(StatusCodes.NOT_FOUND).send('Task not found');
  }
  const actionCount = await Action.countDocuments({ taskId });
  if (actionCount > 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Cannot delete task with associated actions.' });
  }
  if (oldTask.jobId) {
    cron.getTasks().forEach((task) => {
      if (task.options.name === oldTask.jobId) {
        task.stop();
      }
    });
  }
  await oldTask.deleteOne({ _id: taskId });
  res.status(StatusCodes.OK).json({ msg: 'task deleted successfully' });
};
module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
