import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { isRole } from "../../middlewares/role.middleware";
import { getUserProfile } from "./user.controller";

const usersRouter = new Hono();

usersRouter.get('/', authMiddleware, isRole("voter"), getUserProfile)

export default usersRouter;