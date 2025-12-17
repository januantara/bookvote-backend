import { voteRepository } from "./vote.repository";

export async function updateVote(userId: string, bookId: number) {
    const existingVote = await voteRepository.vote(userId, bookId);

    return existingVote;
}