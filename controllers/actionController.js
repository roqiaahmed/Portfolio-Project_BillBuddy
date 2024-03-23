const Action = require("../models/action");
const Service = require("../models/Services");
const Task = require("../models/task");
const { uploadFiles, deleteFile } = require("../utils/uploadUtil");
const { StatusCodes } = require("http-status-codes");

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

  const actions = await Action.find(queryObject).sort({ createdAt: -1 });
  res.status(StatusCodes.OK).json({ count: actions.length, actions });
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

  const action = await Action.create(newAction);
  res.status(StatusCodes.CREATED).json({ action });
};

const getAction = async (req, res) => {
  const { taskId, actionId } = req.params;
  const action = await Action.findOne({ _id: actionId, taskId });
  if (!action) {
    return res.status(StatusCodes.NOT_FOUND).send("Action not found");
  }
  res.status(StatusCodes.OK).json({ action });
};

const updateAction = async (req, res) => {
  const { taskId, actionId } = req.params;
  const { status } = req.body;
  const oldAction = await Action.findOne({ _id: actionId, taskId });
  if (!oldAction) {
    return res.status(StatusCodes.NOT_FOUND).send("Action not found");
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

  const updatedAction = await Action.findByIdAndUpdate(actionId, action, {
    new: true,
  });
  res.status(StatusCodes.OK).json({ action: updatedAction });
};

const deleteAction = async (req, res) => {
  const { taskId, actionId } = req.params;
  const action = await Action.findOne({ _id: actionId, taskId });
  if (!action) {
    return res.status(StatusCodes.NOT_FOUND).send("Action not found");
  }

  await Action.findByIdAndDelete(actionId);
  if (action.images && action.images.length > 0) {
    const path = await folderPath(req, res);
    for (const imageUrl of action.images) {
      await deleteFile(imageUrl, path);
    }
  }
  res.status(StatusCodes.OK).send("Action deleted");
};

module.exports = {
  getAllActions,
  createAction,
  getAction,
  updateAction,
  deleteAction,
};
