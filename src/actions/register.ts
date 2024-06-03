"use server";

import * as z from "zod"
import { RegisterSchema } from "@/src/schemas"
import bcrypt from "bcryptjs"
import { db } from "@/src/lib/db";
import { getUserByEmail } from "@/src/data/user";
import { generateVerificationTOken } from "@/src/lib/token";
import { sendVerificationEmail } from "@/src/lib/mail";


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
            email: email.toLowerCase(),
            organization,
            password: hashedPassword,
        },
    });

    // TODO: Send Verification token email
    const verificationToken = await generateVerificationTOken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Registration Success kindly check your email for verification link!" }
}
