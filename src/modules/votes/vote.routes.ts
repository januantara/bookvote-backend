import { Hono } from "hono";
import { getUserVote, updateVote } from "./vote.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { isRole } from "../../middlewares/role.middleware";

const votesRouter = new Hono();

votesRouter.post('/:bookId', authMiddleware, isRole("voter"), updateVote)
votesRouter.delete('/:bookId', authMiddleware, isRole("voter"), updateVote)
votesRouter.get('/my-votes', authMiddleware, isRole("voter"), getUserVote)

export default votesRouter;