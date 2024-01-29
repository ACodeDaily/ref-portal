"use server";

import { db } from "@/src/lib/db";
import { currentUser } from "@/src/lib/auth";
import { getUserById } from "@/src/data/user";



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