import { getAllUsersWithRole, UserQuery } from "@/data/user";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";


interface ApiResponse {
    data?: ({
        id: string;
        name: string | null;
        email: string | null;
        emailVerified: Date | null;
        image: string | null;
        password: string | null;
        organization: string | null;
        isVerified: boolean;
        role: UserRole;
        isTwoFactorEnabled: boolean;
    })[] | null;
    error?: string;
}

export async function GET() {
    const role = await currentRole()
    const query: UserQuery = {
        role: [UserRole.USER],
    };
    if (role === UserRole.ADMIN || role === UserRole.MOD) {
        const data = await getAllUsersWithRole(query);
        const response: ApiResponse = { data };
        return new NextResponse(JSON.stringify(response), { status: 200 })
    }
    return new NextResponse(null, {
        status: 403
    });
}
