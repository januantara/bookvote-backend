import { Hono } from "hono";
import { login, logout, refresh, register } from "./auth.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const authRouter = new Hono()

// Public Routes
authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.post("/refresh", refresh)

// Protected Route
authRouter.post("/logout", authMiddleware, logout)

export default authRouter;