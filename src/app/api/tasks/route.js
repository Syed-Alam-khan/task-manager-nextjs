import { NextResponse } from "next/server";
import Notification from "@/models/Notification";
import connectDB from "@/config/db";
import Task from "@/models/Task";
import Category from "@/models/Category";
import isAuth from "@/lib/isAuth";

// create task
export async function POST(request) {
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

    const {
      title,
      description,
      priority,
      status,
      dueDate,
      category,
      completed,
    } = await request.json();

    // Validation
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        { status: 400 }
      );
    }

    // Check category belongs to logged-in user
    if (category) {
      const categoryExists = await Category.findOne({
        _id: category,
        user: auth.userId,
      });

      if (!categoryExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category.",
          },
          { status: 404 }
        );
      }
    }

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      completed,
      category,
      user: auth.userId,
    });
    
    await Notification.create({
  title: "Task Created",
  message: `${task.title} created successfully.`,
  task: task._id,
  user: auth.userId,
});
    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully.",
        task,
      },
      { status: 201 }
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
// Get All Tasks
export async function GET(request) {
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

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const completed = searchParams.get("completed");

    // Pagination
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      user: auth.userId,
    };

    // Search
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

    // Status Filter
    if (status) {
      filter.status = status;
    }

    // Priority Filter
    if (priority) {
      filter.priority = priority;
    }

    // Category Filter
    if (category) {
      filter.category = category;
    }

    // Completed Filter
    if (completed !== null) {
      filter.completed = completed === "true";
    }

    // Total Tasks
    const totalTasks = await Task.countDocuments(filter);

    // Get Tasks
    const tasks = await Task.find(filter)
      .populate("category", "name color")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        pagination: {
          totalTasks,
          currentPage: page,
          totalPages: Math.ceil(totalTasks / limit),
          limit,
          hasNextPage: page < Math.ceil(totalTasks / limit),
          hasPreviousPage: page > 1,
        },
        tasks,
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
