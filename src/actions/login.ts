"use server";

import * as z from "zod"
import { LoginSchema } from "@/src/schemas"
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateTwoFactorToken, generateVerificationTOken } from "@/src/lib/token";
import { getUserByEmail } from "@/src/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/src/lib/mail";
import { getTwoFactorTokenByEmail } from "@/src/data/two-factor-token";
import { db } from "@/src/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/src/data/two-factor-confirmation";



export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email, password, code } = validatedFields.data;

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

    // for verification using admin or mod
    if (!existingUser.isVerified) {
        return { error: "Account is being verified by Admin" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {

        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email)

            if (!twoFactorToken) {
                return { error: "Invalid code!" }
            }

            if (twoFactorToken.token !== code) {
                return { error: "Invalid code!" }
            }

            const hasExpired = new Date(twoFactorToken.expires) < new Date()

            if (hasExpired) {
                return { error: "Code expired!" }
            }

            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id }
            })

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id }
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })

        } else {

            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token
            )

            return { twoFactor: true }
        }
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

