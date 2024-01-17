"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getUserById } from "@/data/user";



export const userDelete = async (
    id: string
) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const dbForm = await getUserById(id);

    if (!dbForm) {
        return { error: "User does not exist" }
    }

    const deletedUser = await db.user.delete({
        where: { id: id },
    });

    return { success: "Deletion Success!", deletedUser }
}