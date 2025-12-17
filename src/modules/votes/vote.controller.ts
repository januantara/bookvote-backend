import { Context } from "hono";
import { updateVote as updateVoteService } from "./vote.service";

export async function updateVote(c: Context) {
    const { bookId } = c.req.param();
    const user = c.get("user");

    if (!user) return c.json({ error: "Unauthorized: Please login first" }, 401);

    const updatedVote = await updateVoteService(user.userId, Number(bookId));

    return c.json({ message: "Vote updated successfully", vote: updatedVote }, 200);
}