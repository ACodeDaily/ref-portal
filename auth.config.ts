import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs"
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";



export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            async authorize(credentials) {
                const validateFields = LoginSchema.safeParse(credentials);
                if (validateFields.success) {
                    const { email, password } = validateFields.data;

                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (passwordsMatch) return user;

                }
                return null;
            }

        })

    ],
} satisfies NextAuthConfig 