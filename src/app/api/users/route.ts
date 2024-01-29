import { getAllUsersWithRole, UserQuery } from "@/src/data/user";
import { currentRole } from "@/src/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
    const role = await currentRole()
    const query: UserQuery = {
        role: [UserRole.USER],
    };
    if (role === UserRole.ADMIN || role === UserRole.MOD) {

        if (role === UserRole.MOD) {
            query.organization = { not: "ACD Team" };
        }

        const data = await getAllUsersWithRole(query);
        return new NextResponse(JSON.stringify({ data }), { status: 200 })
    }
    return new NextResponse(null, {
        status: 403
    });
}
