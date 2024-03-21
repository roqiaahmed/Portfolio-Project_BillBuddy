const Task = require("../models/task");
const Service = require("../models/Services");
const Action = require("../models/action");
const cron = require("node-cron");
const { sendNotification } = require("../utils/notificationService");

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
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(queryObject)
      .sort("reminderDay")
      .limit(limit)
      .skip(skip);

    res.status(200).json({ count: tasks.length, tasks });
  } catch (error) {
    console.log({ error });
  }
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
    try {
      job = cron.schedule(`*/${reminderDay} * * * *`, () => {
        sendNotification(`${serviceName} - ${name}`);
      });
      job.start();
    } catch (error) {
      console.log(error);
    }
  }
  console.log("job ============> ", job.options.name);
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
  const { serviceId, taskId } = req.params;
  try {
    const task = await Task.findOne({ _id: taskId, serviceId });
    if (!task) {
      return res.status(404).send("Task not found");
    }
    res.status(200).json({ task });
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateTask = async (req, res) => {
  const { serviceId, taskId } = req.params;
  const { name } = req.body;
  const oldTask = await Task.findOne({ _id: taskId, serviceId });
  console.log("oldTask", oldTask);
  if (!oldTask) {
    return res.status(404).send("Task not found");
  }
  const service = await Service.findOne({ _id: serviceId });
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
    try {
      const job = cron.schedule(`*/${reminderDay} * * * *`, () => {
        sendNotification(`${serviceName} - ${name}`);
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
    } catch (error) {
      console.log(error);
    }
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
  res.status(200).json({ msg: "task updated successfully", task: updated });
};

const deleteTask = async (req, res) => {
  const { serviceId, taskId } = req.params;
  const oldTask = await Task.findOne({ _id: taskId, serviceId });
  if (!oldTask) {
    return res.status(404).send("Task not found");
  }
  const actionCount = await Action.countDocuments({ serviceId });
  if (actionCount > 0) {
    return res
      .status(400)
      .json({ msg: "Cannot delete task with associated actions." });
  }
  if (oldTask.jobId) {
    cron.getTasks().forEach((task) => {
      if (task.options.name === oldTask.jobId) {
        task.stop();
      }
    });
  }
  await oldTask.deleteOne({ _id: taskId });
  res.status(200).json({ msg: "task deleted successfully" });
};
module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};
