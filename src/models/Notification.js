import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,

  notificationDate: {
    type: String,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
},{
    timestamps:true
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;