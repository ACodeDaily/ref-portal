import { currentUser } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { Status, UserRole } from "@prisma/client";

export const getFormbyId = async (id: string) => {
    try {
        const form = await db.form.findUnique({
            where: { id }
        });

        return form;
    } catch {
        return null;
    }
};

export const getFormsByMemberIdWithOrganization = async (formId: string) => {
    const user = await currentUser();

    try {
        if (!formId) return null;

        let forms;

        if (user?.role === UserRole.ADMIN || user?.role === UserRole.MOD) {

            forms = await db.form.findMany({
                where: { formId },
                include: {
                    member: true,
                },

            });
        }
        else if (user?.role === UserRole.REFERRER) {
            forms = await db.form.findMany({
                where: {
                    formId: formId,
                    organization: user.organization,
                    status: Status.PENDING
                },
                include: {
                    member: true,
                },

            });
        }

        const uniqueMembers = new Set(forms?.map((form) => form.member));

        const uniqueMembersArray = Array.from(uniqueMembers);

        const formsWithoutMembers = forms?.map((form) => {
            const { member, ...formWithoutMember } = form;
            return formWithoutMember;
        });

        return {
            forms: forms,
            member: uniqueMembersArray.length >= 1 ? uniqueMembersArray[0] : null,
        };

    } catch {
        return null;
    }
};
