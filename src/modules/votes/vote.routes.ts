import { Hono } from "hono";
import { updateVote } from "./vote.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { isRole } from "../../middlewares/role.middleware";

const votesRouter = new Hono();

votesRouter.post('/:bookId', authMiddleware, isRole("voter"), updateVote)
votesRouter.delete('/:bookId', authMiddleware, isRole("voter"), updateVote)

export default votesRouter;