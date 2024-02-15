<<<<<<< HEAD
import { getALlMember, getAllMembersWithForm } from "@/src/data/member";
=======
import { getAllMembersWithForm, getAllMembersWithFormByOrganizationAndRefferer } from "@/src/data/member";
>>>>>>> b5330f3594273f41ee419e4f2055a4969a0b7da5
import { currentRole, currentUser } from "@/src/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";



export async function GET() {
    const role = await currentRole();

    const user = await currentUser();
    if (role === UserRole.ADMIN || role === UserRole.MOD) {
        const data = await getAllMembersWithForm();
        return new NextResponse(JSON.stringify({
            acceptedForms: data?.acceptedForms,
            rejectedForms: data?.rejectedForms,
            pendingForms: data?.pendingForms,
            role,
            user
        }), { status: 200 })
    }

<<<<<<< HEAD
=======
    else if (role === UserRole.REFERRER) {
        if (user?.email && user.organization !== undefined){
            const data = await getAllMembersWithFormByOrganizationAndRefferer(user?.organization, user?.id);
            return new NextResponse(JSON.stringify({
                acceptedForms: data?.acceptedForms,
                rejectedForms: data?.rejectedForms,
                pendingForms: data?.pendingForms,
                role,
                user
            }), { status: 200 })
        }
        
    }
>>>>>>> b5330f3594273f41ee419e4f2055a4969a0b7da5
    return new NextResponse(null, {
        status: 403
    });
}





