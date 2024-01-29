"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/src/lib/db";
import { SettingSchema } from "@/src/schemas";
import { getUserById } from "@/src/data/user";
import { currentUser } from "@/src/lib/auth";

export const settings = async (
    values: z.infer<typeof SettingSchema>
) => {
    const user = await currentUser();

    if (!user || !user.id) {
        return { error: "Unauthorized" }
    }

    const dbUser = await getUserById(user.id);

    if (!dbUser) {
        return { error: "Unauthorized" }
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        );

        if (!passwordsMatch) {
            return { error: "Incorrect password!" };
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10,
        );
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        }
    });

    return { success: "Settings Updated!" }
}