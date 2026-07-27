import { NextResponse } from "next/server";

import connectDB from "@/config/db";
import Category from "@/models/Category";
import isAuth from "@/lib/isAuth";

// update category 
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
    const { name, color } = await request.json();

    console.log("Params ID:", id);
   console.log("Auth User ID:", auth.userId);
    const category = await Category.findOne({
      _id: id,
      user: auth.userId,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    category.name = name || category.name;
    category.color = color || category.color;

    await category.save();

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully.",
        category,
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
// delete category
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

    const category = await Category.findOneAndDelete({
      _id: id,
      user: auth.userId,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully.",
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