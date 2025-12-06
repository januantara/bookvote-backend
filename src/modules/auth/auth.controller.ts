import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { loginSchema, registerSchema } from "./auth.validation";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshSession
} from "./auth.service";

// REGISTER
export async function register(c: Context) {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
    }

    const newUser = await registerUser(parsed.data);
    if ('error' in newUser) return c.json({ error: newUser.error }, 409);

    return c.json({
        message: "User registered successfully",
    }, 201);
}

// LOGIN
export async function login(c: Context) {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
        return c.json({ error: parsed.error.message }, 400);
    }

    const loginResult = await loginUser(
        parsed.data.nim,
        parsed.data.password
    );

    if (!loginResult) return c.json({ error: "Nim or password is incorrect!" }, 401);
    const { user, accessToken, refreshToken } = loginResult;

    setCookie(c, "refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({ message: "Login successful", user, accessToken });
}

// LOGOUT
export async function logout(c: Context) {
    const token = getCookie(c, "refresh_token");

    if (!token) {
        return c.json({ error: "Refresh token not found" }, 400);
    }

    await logoutUser(token);
    deleteCookie(c, "refresh_token");

    return c.json({ message: "Logout successful" });
}

// REFRESH TOKEN
export async function refresh(c: Context) {
    const oldRefreshToken = getCookie(c, "refresh_token");

    if (!oldRefreshToken) {
        return c.json({ error: "Refresh token not found" }, 401);
    };

    const result = await refreshSession(oldRefreshToken);
    if ('error' in result) {
        deleteCookie(c, "refresh_token");
        return c.json({ error: result.error }, result.status);
    }

    const { newAccessToken, newRefreshToken } = result;

    setCookie(c, "refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    });

    return c.json({
        message: "Token successfully refreshed",
        accessToken: newAccessToken,
    });
}
