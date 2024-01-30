import { db } from "@/src/lib/db";
import { Status } from "@prisma/client";

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

export const getMemberbyId = async (id: string) => {
    try {
        const member = await db.member.findUnique({
            where: { id }
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
                        status: Status.PENDING,
                    },
                },
            },

        });

        return members
    } catch {
        return null;
    }
};


export const getMemberbyCodeForcesIdWithForms = async (codeForces: string) => {
    try {
        const member = await db.member.findUnique({
            where: { codeForces },
            include: {
                forms: true
            }

        });

        if (!member) {
            throw new Error(`Member with CodeForces username ${codeForces} not found`);
        }

        return member;
    } catch {
        return null;
    }
};