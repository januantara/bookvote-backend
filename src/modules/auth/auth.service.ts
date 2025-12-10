import { type CreateUserProps, userRepository } from "./user.repository";

import {
    generateAccessToken,
    generateRefreshToken,
    getRefreshTokenExpiry
} from "../../utils/jwt";
import { refreshTokenRepository } from "./refreshToken.repository";

// =====================================================
// USER AUTH LOGIC
// =====================================================

// Validate credentials
export async function validateUserCredentials(nim: string, password: string) {
    const user = await userRepository.findByNim(nim);
    if (!user) return null;

    const match = await Bun.password.verify(password, user.passwordHash);
    if (!match) return null;

    return user;
}


// =====================================================
// REGISTER
// =====================================================

export async function registerUser(data:
    Omit<CreateUserProps, 'passwordHash'> & { password: string }
) {
    // Cek apakah user sudah ada
    const exists = await userRepository.findByEmailOrNim(data.email, data.nim);
    if (exists) return { error: "Email or student ID already registered" };

    const passwordHash = await Bun.password.hash(data.password);

    // Delegate ke repository
    return await userRepository.create({
        fullname: data.fullname,
        email: data.email,
        passwordHash,
        nim: data.nim,
        role: data.role ?? "voter",
    });
}


// =====================================================
// LOGIN
// =====================================================

export async function loginUser(nim: string, password: string) {
    const user = await validateUserCredentials(nim, password);
    if (!user) return null;

    const accessToken = await generateAccessToken(user.id, user.role);

    const refreshToken = generateRefreshToken();
    const expiresAt = getRefreshTokenExpiry();

    await refreshTokenRepository.save(user.id, refreshToken, expiresAt);

    return {
        user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            nim: user.nim,
            role: user.role,
            createdAt: user.createdAt
        },
        accessToken,
        refreshToken,
    };
}


// =====================================================
// REFRESH SESSION
// =====================================================

export async function refreshSession(oldRefreshToken: string) {
    const record = await refreshTokenRepository.find(oldRefreshToken);
    if (!record) return { error: "Refresh token not found", status: 401 as const };

    // expired check
    if (record.expiresAt < new Date()) {
        await refreshTokenRepository.revoke(oldRefreshToken);
        return { error: "Refresh token is invalid or has expired", status: 401 as const };
    }

    // get user
    const user = await userRepository.findById(record.userId);
    if (!user) return { error: "User not found", status: 404 as const };

    // ROTATE refresh token
    await refreshTokenRepository.revoke(oldRefreshToken);

    const newRefreshToken = generateRefreshToken();
    const newExpires = getRefreshTokenExpiry();

    await refreshTokenRepository.save(user.id, newRefreshToken, newExpires);

    // Generate new access token
    const newAccessToken = await generateAccessToken(user.id, user.role);

    return {
        user,
        newAccessToken,
        newRefreshToken,
    };
}


// =====================================================
// LOGOUT
// =====================================================

export async function logoutUser(refreshToken: string) {
    await refreshTokenRepository.revoke(refreshToken);
}