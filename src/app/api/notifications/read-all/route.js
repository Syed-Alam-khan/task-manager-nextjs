import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Notification from "@/models/Notification";
import isAuth from "@/lib/isAuth";

export async function PUT() {
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

    await Notification.updateMany(
      {
        user: auth.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "All notifications marked as read.",
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