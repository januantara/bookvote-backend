import { Context, Next } from "hono";

export function isRole(...allowedRoles: string[]) {
    return async (c: Context, next: Next) => {
        const user = c.get("user");
        if (!user || !allowedRoles.includes(user.role)) {
            return c.json({ error: "Forbidden: role tidak diizinkan" }, 403);
        }
        return next();
    };
}
