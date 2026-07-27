import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Task from "@/models/Task";
import Category from "@/models/Category";
import isAuth from "@/lib/isAuth";
import Notification from "@/models/Notification";

// update task
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

        const {
            title,
            description,
            priority,
            status,
            dueDate,
            completed,
            category,
        } = await request.json();

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

        // Validate category if provided
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

            task.category = category;
        }

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.priority = priority ?? task.priority;
        task.status = status ?? task.status;
        task.dueDate = dueDate ?? task.dueDate;

        if (completed !== undefined) {
            task.completed = completed;
        }

        await task.save();
       await Notification.create({
  title: "Task Updated",
  message: `${task.title} updated successfully.`,
  task: task._id,
  user: auth.userId,
});
        return NextResponse.json(
            {
                success: true,
                message: "Task updated successfully.",
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
// get single task
export async function GET(request, { params }) {
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

        const task = await Task.findOne({
            _id: id,
            user: auth.userId,
        }).populate("category", "name color");

        if (!task) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Task not found.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
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
// delete task 
export async function DELETE(request, { params }) {
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

        await Notification.create({
            title: "Task Deleted",
            message: `${task.title} deleted successfully.`,
            user: auth.userId,
        });

        await task.deleteOne();

        return NextResponse.json(
            {
                success: true,
                message: "Task deleted successfully.",
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