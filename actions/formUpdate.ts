"use server";


import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { Status } from "@prisma/client";
import { getFormbyId } from "@/data/form";

interface formUpdateProps {
    referrerResponse: string | undefined
    status: Status
    id: string
}


export const formUpdate = async (
    data: formUpdateProps
) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized" }
    }

    const { referrerResponse, status, id } = data;

    const dbForm = await getFormbyId(id);

    if (!dbForm) {
        return { error: "Form does not exist" }
    }

    const updatedForm = await db.form.update({
        where: { id: id },
        data: {
            referrerResponse: referrerResponse,
            status: status,
        }
    });



    return { success: "Settings Updated!", updatedForm }
}