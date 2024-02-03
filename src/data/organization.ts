import { db } from "@/src/lib/db";

export const getOrganizationbyId = async (id: string) => {
    try {
        const organization = await db.organization.findUnique({
            where: { id }
        });

        return organization;
    } catch {
        return null;
    }
};

export const getOrganizationbyName = async (name: string) => {

    try {
        const organization = await db.organization.findUnique({
            where: { normalizedLowerCase: name }
        });

        return organization;
    } catch {
        return null;
    }
};

export const getAllOrganization = async () => {
    try {
        const organizations = await db.organization.findMany({
        });
        return organizations;
    } catch (error) {
        console.error('Error fetching organizations', error);
        return null;
    }
};
