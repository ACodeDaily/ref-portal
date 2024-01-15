import { NextRequest, NextResponse } from 'next/server';
import { generateSecretToken } from "@/lib/token";



export async function GET(req: NextRequest) {
    const cfUserName = req.nextUrl.searchParams.get('cfUserName') as string;
    const discordId = req.nextUrl.searchParams.get('discordId') as string;
    if (!cfUserName || !discordId) {
        return new NextResponse(null, {
            status: 400
        })
    }
    const data = await generateSecretToken(cfUserName, discordId);
    const url = `http://localhost:3000/get-details?token=${data?.token}`
    return new NextResponse(JSON.stringify({ url }), { status: 200 })
}



