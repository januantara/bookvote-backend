import { Hono } from "hono";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { isRole } from "../../middlewares/role.middleware";
import { getUserVote } from "./user.controller";

const usersRouter = new Hono();

usersRouter.get('/my-votes', authMiddleware, isRole("voter"), getUserVote)

export default usersRouter;