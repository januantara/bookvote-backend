import { db } from "../../config/db";
import { refreshTokens } from "../../db/schema";
import { eq } from "drizzle-orm";

export const refreshTokenRepository = {
    find: (token: string) =>
        db.query.refreshTokens.findFirst({
            where: (rt) => eq(rt.token, token),
        }),

    save: (userId: string, token: string, expiresAt: Date) =>
        db.insert(refreshTokens).values({ userId, token, expiresAt }),

    revoke: (token: string) =>
        db.delete(refreshTokens).where(eq(refreshTokens.token, token)),
};
