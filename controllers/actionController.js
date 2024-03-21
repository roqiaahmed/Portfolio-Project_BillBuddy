const Action = require("../models/action");
const Service = require("../models/Services");
const Task = require("../models/task");
const { uploadFiles, deleteFile } = require("../utils/uploadUtil");

const folderPath = async (req, res) => {
  const service = await Service.findOne({ _id: req.params.serviceId });
  const serviceName = service.name;
  const task = await Task.findOne({ _id: req.params.taskId });
  const taskName = task.name;
  const folderPath = `${serviceName}/${taskName}`;
  return folderPath;
};

const getAllActions = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.query;
  const queryObject = {
    taskId,
  };
  if (status) {
    queryObject.status = status;
  }
  try {
    const actions = await Action.find(queryObject).sort({ createdAt: -1 });
    res.status(200).json({ count: actions.length, actions });
  } catch (error) {
    console.error("Error getting actions:", error);
    res.status(500).send("Internal Server Error");
  }
};

const createAction = async (req, res) => {
  const { taskId } = req.params;
  const status = req.body.status || "pending";
  const newAction = {
    taskId,
    status,
  };

  const path = await folderPath(req, res);

  const files = await uploadFiles(req, res, path);
  if (files) {
    const images = files.map((url) => url);
    newAction.images = images;
  }
  try {
    const action = await Action.create(newAction);
    res.status(201).json({ action });
  } catch (error) {
    console.error("Error creating action:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getAction = async (req, res) => {
  const { taskId, actionId } = req.params;
  try {
    const action = await Action.findOne({ _id: actionId, taskId });
    if (!action) {
      return res.status(404).send("Action not found");
    }
    res.status(200).json({ action });
  } catch (error) {
    console.error("Error getting action:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateAction = async (req, res) => {
  const { taskId, actionId } = req.params;
  const { status } = req.body;
  const oldAction = await Action.findOne({ _id: actionId, taskId });
  if (!oldAction) {
    return res.status(404).send("Action not found");
  }
  const action = {
    status,
  };
  const path = await folderPath(req, res);

  const files = await uploadFiles(req, res, path);
  if (files) {
    const images = files.map((url) => url);
    action.images = images;
  }

  try {
    const updatedAction = await Action.findByIdAndUpdate(actionId, action, {
      new: true,
    });
    res.status(200).json({ action: updatedAction });
  } catch (error) {
    console.error("Error updating action:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteAction = async (req, res) => {
  const { taskId, actionId } = req.params;
  const action = await Action.findOne({ _id: actionId, taskId });
  if (!action) {
    return res.status(404).send("Action not found");
  }
  try {
    await Action.findByIdAndDelete(actionId);
    if (action.images && action.images.length > 0) {
      const path = await folderPath(req, res);
      for (const imageUrl of action.images) {
        await deleteFile(imageUrl, path);
      }
    }
    res.status(200).send("Action deleted");
  } catch (error) {
    console.error("Error deleting action:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllActions,
  createAction,
  getAction,
  updateAction,
  deleteAction,
};
