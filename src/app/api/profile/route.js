import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import User from "@/models/User";
import isAuth from "@/lib/isAuth";

// Get Profile
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

    const user = await User.findById(auth.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user,
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
// Update Profile
export async function PUT(request) {
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

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and email are required.",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(auth.userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Check email already used by another user
    const existingUser = await User.findOne({
      email,
      _id: { $ne: auth.userId },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already in use.",
        },
        { status: 400 }
      );
    }

    user.name = name;
    user.email = email;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
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