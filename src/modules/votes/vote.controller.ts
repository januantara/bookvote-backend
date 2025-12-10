import { Context } from "hono";
import { getUserVotes, updateVote as updateVoteService } from "./vote.service";

export async function getUserVote(c: Context) {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized: Please login first" }, 401);

    const votedBooks = await getUserVotes(user.userId);
    if (votedBooks.length === 0) {
        return c.json({ error: "No votes found for this user" }, 404);
    }

    return c.json({ message: "User votes retrieved successfully", votes: votedBooks }, 200);
}

export async function updateVote(c: Context) {
    const { bookId } = c.req.param();
    const user = c.get("user");

    if (!user) return c.json({ error: "Unauthorized: Please login first" }, 401);

    const updatedVote = await updateVoteService(user.userId, Number(bookId));

    return c.json({ message: "Vote updated successfully", vote: updatedVote }, 200);
}