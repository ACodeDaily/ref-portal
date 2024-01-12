import { getALlMember } from "@/data/member";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";


interface ApiResponse {
    data?: ({
        id: string;
        name: string | null;
        email: string | null;
        codeForces: string | null;
        leetcode: string | null;
    })[] | null;
    error?: string;
}

export async function GET() {
    const role = await currentRole()

    if (role !== UserRole.USER) {
        const data = await getALlMember();
        const response: ApiResponse = { data };
        return new NextResponse(JSON.stringify(response), { status: 200 })
    }
    return new NextResponse(null, {
        status: 403
    });
}





