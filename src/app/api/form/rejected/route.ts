import { getALlMember, getAllMembersWithFormByOrganizationAndStatus, getAllMembersWithForm } from "@/src/data/member";
import { currentRole, currentUser } from "@/src/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";



export async function GET() {
    const role = await currentRole();

    const user = await currentUser();

    if (role === UserRole.ADMIN || role === UserRole.MOD) {
        const data = await getAllMembersWithForm();
        return new NextResponse(JSON.stringify({ data, role, user }), { status: 200 })
    }

    else if (role === UserRole.REFERRER) {
        const data = await getAllMembersWithFormByOrganizationAndStatus(user?.organization || "", "REJECTED");
        return new NextResponse(JSON.stringify({ data , role, user}), { status: 200 })
    }
    return new NextResponse(null, {
        status: 403
    });
}





