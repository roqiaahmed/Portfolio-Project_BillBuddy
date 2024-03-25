const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Types.ObjectId, ref: 'Task' },
    status: {
      type: String,
      enum: ['done', 'inprogress', 'pending'],
      default: 'pending',
    },

    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Action', actionSchema);
