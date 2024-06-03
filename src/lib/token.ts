import { v4 as uuidv4 } from "uuid"
import crypto from 'crypto'
import { getVerificationTOkenBYEmail } from "@/src/data/verifiction-token";
import { getPasswordResetTokenByEmail } from "@/src/data/password-reset-token";
import { db } from "@/src/lib/db";
import { getTwoFactorTokenByEmail } from "@/src/data/two-factor-token";
import { getSecretTokenByCfUserName } from "@/src/data/secret_token";

export const generateVerificationTOken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTOkenBYEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return verificationToken
}

export const generatePasswordResetTOken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email: email.toLowerCase(),
            token,
            expires,
        }
    })

    return passwordResetToken
}

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_100).toString();

    // TODO later change to 5 min
    const expires = new Date(new Date().getTime() + 300 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return twoFactorToken
}


// secret key generation for user form submission

export const generateSecretToken = async (cfUserName: string, discordId: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getSecretTokenByCfUserName(cfUserName);
    if (existingToken) {
        await db.secretToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const secretToken = await db.secretToken.create({
        data: {
            cfUserName,
            discordId,
            token,
            expires,
        }
    })

    return secretToken
}
