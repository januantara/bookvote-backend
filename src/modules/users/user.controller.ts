import { Context } from "hono";
import { userService } from "./user.service";

export async function getUserProfile(c: Context) {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized: Please login first" }, 401);

    let votedBooks = await userService.getUserVotes(user.userId);
    let requestedBooks = await userService.getRequestedBooks(user.userId);
    let purchasedBooks = await userService.getPurchasedBooks(user.userId);

    if (votedBooks.length === 0) {
        votedBooks = [];
    }

    if (requestedBooks.length === 0) {
        requestedBooks = [];
    }

    if (purchasedBooks.length === 0) {
        purchasedBooks = [];
    }

    return c.json({
        message: "User profile fetched successfully",
        votedBooks,
        requestedBooks,
        purchasedBooks
    });
}