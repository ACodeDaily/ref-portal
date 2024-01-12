"use server";


import { db } from "@/lib/db";

import { getUserById } from "@/data/user";
import { roleFinder } from "@/data/account";


interface requestUpdateProps {
    currentRole: string
    id: string
}


export const requestUpdate = async (
    data: requestUpdateProps
) => {

    const { currentRole, id } = data;
    const dbUser = await getUserById(id);

    if (!dbUser) {
        return { error: "User Not Found" }
    }

    const role = roleFinder(currentRole);


    const updatedUser = await db.user.update({
        where: { id: id },
        data: {
            role: role,
            isVerified: true,
        }
    });

    console.log(updatedUser)

    return { success: "User is verified and role updated" }
}