import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Task from "@/models/Task";
import isAuth from "@/lib/isAuth";

// get dashbaord stats for charts etc
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

    const totalTasks = await Task.countDocuments({
      user: auth.userId,
    });

    const completedTasks = await Task.countDocuments({
      user: auth.userId,
      completed: true,
    });

    const pendingTasks = await Task.countDocuments({
      user: auth.userId,
      status: "Pending",
    });

    const inProgressTasks = await Task.countDocuments({
      user: auth.userId,
      status: "In Progress",
    });

    const highPriorityTasks = await Task.countDocuments({
      user: auth.userId,
      priority: "High",
    });

    const lowPriorityTasks = await Task.countDocuments({
      user: auth.userId,
      priority: "Low",
    });

    const mediumPriorityTasks = await Task.countDocuments({
      user: auth.userId,
      priority: "Medium",
    });

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          highPriorityTasks,
          mediumPriorityTasks,
          lowPriorityTasks,
          completionRate,
        },
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