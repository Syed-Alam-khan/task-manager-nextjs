import { NextResponse } from "next/server";

import Notification from "@/models/Notification";
import connectDB from "@/config/db";
import Task from "@/models/Task";
import isAuth from "@/lib/isAuth";

// update task status
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const auth = await isAuth();

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { status, completed } = await request.json();

    const task = await Task.findOne({
      _id: id,
      user: auth.userId,
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found.",
        },
        { status: 404 }
      );
    }

    if (status !== undefined) {
      task.status = status;

      if (status === "Completed") {
        task.completed = true;
      } else {
        task.completed = false;
      }
    }

    if (completed !== undefined && status === undefined) {
      task.completed = completed;

      if (completed) {
        task.status = "Completed";
      } else if (task.status === "Completed") {
        task.status = "Pending";
      }
    }

    await task.save();
 if (task.status === "Completed") {
  await Notification.create({
    title: "Task Completed",
    message: `${task.title} marked as completed.`,
    task: task._id,
    user: auth.userId,
  });
}

if (task.status === "In Progress") {
  await Notification.create({
    title: "Task In Progress",
    message: `${task.title} is now in progress.`,
    task: task._id,
    user: auth.userId,
  });
}

if (task.status === "Pending") {
  await Notification.create({
    title: "Task Pending",
    message: `${task.title} moved back to pending.`,
    task: task._id,
    user: auth.userId,
  });
}
    return NextResponse.json(
      {
        success: true,
        message: "Task status updated successfully.",
        task,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}