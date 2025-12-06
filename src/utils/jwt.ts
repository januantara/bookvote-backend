import { SignJWT } from "jose";

export const jwtSecret = new TextEncoder().encode(Bun.env.JWT_SECRET_KEY!);

// Akses token
export async function generateAccessToken(userId: string, role: string) {
    const now = Math.floor(Date.now() / 1000);

    return await new SignJWT({
        sub: userId,
        role,
        iat: now,
        jti: crypto.randomUUID()
    })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime("15m")
        .sign(jwtSecret);
}

// Generate Refresh token
export function generateRefreshToken() {
    return crypto.randomUUID();
}

// Expired: 7 days
export function getRefreshTokenExpiry() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
}
