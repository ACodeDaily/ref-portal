import { db } from "@/src/lib/db";

export const getSecretTokenByCfUserName = async (cfUserName: string) => {
    try {
        const secretToken = await db.secretToken.findFirst({
            where: { cfUserName }
        })

        return secretToken;
    } catch {
        return null;
    }
}

export const getSecretTokenByToken = async (token: string) => {
    try {
        const secretToken = await db.secretToken.findUnique({
            where: { token }
        })

        return secretToken;
    } catch {
        return null;
    }
}