import { Context, Next } from "hono";
import { jwtVerify } from "jose";

const jwtSecret = new TextEncoder().encode(Bun.env.JWT_SECRET_KEY!);

// JWT Middleware for protected routes
export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized: Access token diperlukan" }, 401);
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify JWT
        const { payload } = await jwtVerify(token, jwtSecret);

        // Set into context for route handlers
        c.set("user", {
            userId: payload.sub,
            role: payload.role,
        });

        return next();
    } catch (err) {
        return c.json({ error: "Unauthorized: Token tidak valid atau kadaluarsa" }, 401);
    }
}
