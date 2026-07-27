import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Notification from "@/models/Notification";
import Task from "@/models/Task";
import isAuth from "@/lib/isAuth";

// Get Notifications
export async function GET() {
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

    // ===============================
    // Auto Reminder Notifications
    // ===============================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayString = today.toISOString().split("T")[0];

    // Get all incomplete tasks
    const tasks = await Task.find({
      user: auth.userId,
      completed: false,
    });

    for (const task of tasks) {
      if (!task.dueDate) continue;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      let title = "";
      let message = "";

      // Due Today
      if (dueDate.getTime() === today.getTime()) {
        title = "📅 Due Today";
        message = `"${task.title}" is due today.`;
      }

      // Due Tomorrow
      else if (dueDate.getTime() === tomorrow.getTime()) {
        title = "⏰ Due Tomorrow";
        message = `"${task.title}" is due tomorrow.`;
      }

      // Overdue
      else if (dueDate < today) {
        title = "🚨 Overdue Task";
        message = `"${task.title}" is overdue. Please complete it.`;
      }

      if (!title) continue;

      // Check if today's reminder already exists
      const notificationExists = await Notification.findOne({
        task: task._id,
        title,
        user: auth.userId,
        notificationDate: todayString,
      });

      if (!notificationExists) {
        await Notification.create({
          title,
          message,
          task: task._id,
          user: auth.userId,
          notificationDate: todayString,
        });
      }
    }

    // ===============================
    // Get Notifications
    // ===============================

    const notifications = await Notification.find({
      user: auth.userId,
    })
      .populate("task", "title status dueDate")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: notifications.length,
        notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      { status: 500 }
    );
  }
}