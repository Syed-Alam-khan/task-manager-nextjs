import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Task from "@/models/Task";
import Category from "@/models/Category";
import isAuth from "@/lib/isAuth";

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

    const tasks = await Task.find({
      user: auth.userId,
    })
      .select(
        "_id title dueDate status priority completed category createdAt"
      )
      .populate("category", "name color")
      .sort({ dueDate: 1 });

    const events = tasks
      .filter((task) => task.dueDate)
      .map((task) => ({
        id: task._id,
        title: task.title,
        start: task.dueDate,
        status: task.status,
        priority: task.priority,
        completed: task.completed,
        category: task.category,
        createdAt: task.createdAt,
      }));

    return NextResponse.json(
      {
        success: true,
        count: events.length,
        events,
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