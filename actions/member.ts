"use server";


import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { getMemberbyId } from "@/data/member";


export const memberDeleteWithForms = async (
    id: string
) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const dbMember = await getMemberbyId(id);

    if (!dbMember) {
        return { error: "Member does not exist" }
    }


    // this will delete all forms related to member due to cascading method
    const deletedMember = await db.member.delete({
        where: { id: id },
    });

    return { success: "Deletion Success!", deletedMember }
}