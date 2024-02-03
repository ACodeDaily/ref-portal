export const dynamic = 'force-dynamic'

import { getAllOrganization } from "@/src/data/organization";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    try {
        const data = await getAllOrganization();
        return new NextResponse(JSON.stringify({ data }), { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 404
        });
    }
}





