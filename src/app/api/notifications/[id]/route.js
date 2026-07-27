import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Notification from "@/models/Notification";
import isAuth from "@/lib/isAuth";

// mark notification as read
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

    const notification = await Notification.findOne({
      _id: id,
      user: auth.userId,
    });

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found.",
        },
        { status: 404 }
      );
    }

    notification.isRead = true;

    await notification.save();

    return NextResponse.json(
      {
        success: true,
        message: "Notification marked as read.",
        notification,
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
// Delete Notification
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

    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: auth.userId,
    });

    if (!notification) {
      return NextResponse.json(
        {
          success: false,
          message: "Notification not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification deleted successfully.",
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