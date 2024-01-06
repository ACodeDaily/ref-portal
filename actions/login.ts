"use server";

import * as z from "zod"
import { LoginSchema } from "@/schemas"
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationTOken } from "@/data/token";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";



export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist!" }
    }

    if (!existingUser.emailVerified) {
        const verifictionToken = await generateVerificationTOken(
            existingUser.email,
        )

        await sendVerificationEmail(verifictionToken.email, verifictionToken.token)

        return { success: "Confirmation email sent!" }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }

                default:
                    return { error: "Something went wrong!" }
            }
        }
        throw error;
    }
}

