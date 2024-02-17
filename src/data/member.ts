import { db } from "@/src/lib/db";
import { Status } from "@prisma/client";

export const getMemberbyCodeForcesId = async (codeForces: string) => {
    try {
        const member = await db.member.findMany({
            where: {
                codeForces: {
                    contains: codeForces,
                    mode: 'insensitive'
                }
            },
        });
        return member[0];
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
        const member = await db.member.findMany({
            where: {
                codeForces: {
                    contains: codeForces,
                    mode: 'insensitive'
                }
            },
            include: {
                forms: true
            }
        });

        if (!member[0]) {
            throw new Error(`Member with CodeForces username ${codeForces} not found`);
        }

        return member[0];
    } catch {
        return null;
    }
};

export const getAllMembersWithFormByOrganizationAndStatus = async (organization: string, needStatus: string) => {
    try {
        const members = await db.member.findMany({
            where: {
                forms: {
                    some: {
                        AND: {
                            organization: organization,
                            status: (needStatus === "PENDING" ? Status.PENDING : (needStatus === "ACCEPTED" ? Status.ACCEPTED : Status.REJECTED)),
                        }
                    },
                },
            },
            include: {
                forms: true
            }
        });
        // console.log(members)
        return members;
    } catch {
        return null;
    }
};

export const getAllMembersWithForm = async () => {
    try {
        const pendingForms = await db.form.findMany({
            where: {
                status: Status.PENDING,
            },
            include: {
                member: true
            }
        });
        const acceptedForms = await db.form.findMany({
            where: {
                status: Status.ACCEPTED,
            },
            include: {
                member: true
            }
        });
        const rejectedForms = await db.form.findMany({
            where: {
                status: Status.REJECTED,
            },
            include: {
                member: true
            }
        });
        return { pendingForms, acceptedForms, rejectedForms };
    } catch {
        return null;
    }
};

export const getAllMembersWithFormByOrganizationAndRefferer = async (organization: string, verifiedBy: string) => {
    try {
        const pendingForms = await db.form.findMany({
            where: {
                AND: {
                    status: Status.PENDING,
                    organization: organization,
                }
            },
            include: {
                member: true
            }
        });
        const acceptedForms = await db.form.findMany({
            where: {
                AND: {
                    status: Status.ACCEPTED,
                    organization: organization,
                    verifiedBy: verifiedBy,
                }
            },
            include: {
                member: true
            }
        });
        const rejectedForms = await db.form.findMany({
            where: {
                AND: {
                    status: Status.REJECTED,
                    organization: organization,
                    verifiedBy: verifiedBy,
                }
            },
            include: {
                member: true
            }
        });
        return { pendingForms, acceptedForms, rejectedForms };
    } catch {
        return null;
    }
};