"use server";

import { db } from "@/src/lib/db";
import { currentRole, currentUser } from "@/src/lib/auth";

import { UserRole } from "@prisma/client";
import { getOrganizationbyId, getOrganizationbyName } from "../data/organization";

interface organizationAddtionProps {
    name: string
}




export const organizationAddition = async (
    data: organizationAddtionProps
) => {
    const user = await currentUser();
    const role = await currentRole();

    if (!user) {
        return { error: "Unauthorized" }
    }



    if (role != UserRole.ADMIN) {
        return { error: "Unauthorized" }
    }

    const { name } = data;

    const lowercaseName = name.toLowerCase();

    const dbOrganization = await getOrganizationbyName(lowercaseName);

    if (dbOrganization) {
        return { error: "Organization Already Exist" }
    }

    await db.organization.create({
        data: {
            normalizedLowerCase: lowercaseName,
            name,
        },
    });



    return { success: "Organization Added!" }
}


export const organizationDelete = async (
    id: string
) => {
    const user = await currentUser();

    const role = await currentRole();

    if (!user) {
        return { error: "Unauthorized" }
    }



    if (role != UserRole.ADMIN) {
        return { error: "Unauthorized" }
    }

    const dbOrganization = await getOrganizationbyId(id);



    if (!dbOrganization) {
        return { error: "Organization does not exist" }
    }

    const deletedOrganization = await db.organization.delete({
        where: { id: id },
    });

    return { success: "Deletion Success!", deletedOrganization }
}