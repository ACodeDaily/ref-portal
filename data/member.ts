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
        const users = await db.member.findMany({

        });
        return users;
    } catch (error) {
        console.error('Error fetching users with role:', error);
        return null;
    }
};


export const getMemberWithFormByOrganization = async (organization: string) => {
    try {
        const members = await db.member.findMany({
            where: {
                forms: {
                    some: {
                        organization: organization,
                    },
                },
            },

        });

        return members
    } catch {
        return null;
    }
};