import { getALlMember, getMemberWithFormByOrganization } from "@/data/member";
import { currentRole, currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";



export async function GET() {
    const role = await currentRole();

    const user = await currentUser();

    if (role === UserRole.ADMIN || role === UserRole.MOD) {
        const data = await getALlMember();
        return new NextResponse(JSON.stringify({ data }), { status: 200 })
    }

    else if (role === UserRole.REFERRER) {
        const data = await getMemberWithFormByOrganization(user?.organization || "");
        return new NextResponse(JSON.stringify({ data }), { status: 200 })
    }
    return new NextResponse(null, {
        status: 403
    });
}





