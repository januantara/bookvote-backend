import { userRepository } from "./user.repository";

export const userService = {
    getRequestedBooks: (userId: string) => userRepository.getRequestedBooks(userId),
    getPurchasedBooks: (userId: string) => userRepository.getPurchasedBooks(userId),
    getUserVotes: (userId: string) => userRepository.getUserVotes(userId),
}