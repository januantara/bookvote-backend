import { Context } from "hono";
import { getUserVotes } from "../votes/vote.service";

export async function getUserVote(c: Context) {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized: Please login first" }, 401);

    const votedBooks = await getUserVotes(user.userId);
    if (votedBooks.length === 0) {
        return c.json({ error: "No votes found for this user" }, 404);
    }

    return c.json({ message: "User votes retrieved successfully", votes: votedBooks }, 200);
}