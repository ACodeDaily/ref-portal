import { getMemberbyCodeForcesIdWithForms } from "@/data/member";
import { NextRequest, NextResponse } from 'next/server';




export async function GET(req: NextRequest) {
    const cfUserName = req.nextUrl.searchParams.get('cfUserName') as string;

    try {
        const data = await getMemberbyCodeForcesIdWithForms(cfUserName);
        return new NextResponse(JSON.stringify({ data }), { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 404
        });
    }
}





