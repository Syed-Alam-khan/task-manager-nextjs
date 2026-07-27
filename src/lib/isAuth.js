import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const isAuth = async () => {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized. Please login.",
      };
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      success: true,
      userId: decoded.id,
    };
  } catch (error) {
    return {
      success: false,
      message: "Invalid or expired token.",
    };
  }
};

export default isAuth;