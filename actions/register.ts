"use server";

import * as z from "zod"
import { RegisterSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationTOken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email, password, name, organization } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {
            error: "Email already in use!"
        }
    }

    await db.user.create({
        data: {
            name,
            email,
            organization,
            password: hashedPassword,
        },
    });

    // TODO: Send Verification token email
    const verificationToken = await generateVerificationTOken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Confrimation email sent" }
}
