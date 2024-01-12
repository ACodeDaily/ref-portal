import { db } from "@/lib/db";

export const getMemberbyCodeForcesId = async (codeForces: string) => {
    try {
        const member = await db.member.findUnique({
            where: { codeForces }
        });

        return member;
    } catch {
        return null;
    }
};

export const getALlMember = async () => {
    try {
        const users = await db.member.findMany();
        return users;
    } catch (error) {
        console.error('Error fetching users with role:', error);
        return null;
    }
};

export const getMemberById = async (id: string) => {
    try {
        if (!id) return null;
        const member = await db.member.findUnique({
            where: { id },
            include: {
                forms: true, // Include the activities related to the member
            },
        });
        return member;
    } catch {
        return null;
    }
};