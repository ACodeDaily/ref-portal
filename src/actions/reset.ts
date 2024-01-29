"use server"
import * as z from "zod"

import { getUserByEmail } from "@/src/data/user"
import { ResetSchema } from "@/src/schemas"
import { generatePasswordResetTOken } from "@/src/lib/token"
import { sendPasswordResetEmail } from "@/src/lib/mail"




export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)

    if (!validatedFields.success) {
        return {
            error: "Invalid emails"
        }
    }

    const { email } = validatedFields.data;


    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
        return {
            error: "Email not found!"
        }
    }



    // TODO: generate token and Send password reset token email

    const passwordResetToken = await generatePasswordResetTOken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)


    return { success: "Reset email sent" }
}

