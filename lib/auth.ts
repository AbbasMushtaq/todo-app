import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_this_for_production";

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed);
};

export const signToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET) as { userId: string, email: string };
    } catch (error) {
        return null;
    }
};

import { cookies } from "next/headers";

export const getAuthUser = async (request?: Request) => {
    // 1. Try to get token from cookies
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (token) {
            return verifyToken(token);
        }
    } catch (error) {
        // cookies() may throw in some contexts
    }

    // 2. Fallback to Authorization header
    if (request) {
        const authHeader = request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            return verifyToken(token);
        }
    }

    return null;
};
