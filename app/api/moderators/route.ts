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
        role: [UserRole.MOD, UserRole.MODREF],
    };
    if (role === UserRole.ADMIN) {
        const data = await getAllUsersWithRole(query);
        console.log(data);
        const response: ApiResponse = { data };
        return new NextResponse(JSON.stringify(response), { status: 200 })
    }
    return new NextResponse(null, {
        status: 403
    });
}
