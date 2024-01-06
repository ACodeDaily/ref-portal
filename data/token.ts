import { v4 as uuidv4 } from "uuid"
import { getVerificationTOkenBYEmail } from "@/data/verifiction-token";
import { db } from "@/lib/db";

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