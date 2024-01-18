import { NextRequest, NextResponse } from 'next/server';
import { generateSecretToken } from "@/lib/token";



export async function GET(req: NextRequest) {

    const expectedSecretKey = process.env.SECRET_KEY;
    const expectedSecretAccessKey = process.env.SECRET_ACCESS_KEY;

    const secretKey = req.headers.get('secretKey');
    const secretAccessKey = req.headers.get('secretAccessKey');

    if (secretKey !== expectedSecretKey || secretAccessKey !== expectedSecretAccessKey) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized access' }), {
            status: 401, // Unauthorized
        });
    }

    const cfUserName = req.nextUrl.searchParams.get('cfUserName') as string;
    const discordId = req.nextUrl.searchParams.get('discordId') as string;
    if (!cfUserName || !discordId) {
        return new NextResponse(JSON.stringify({ error: 'username not present' }), {
            status: 400
        })
    }
    const data = await generateSecretToken(cfUserName, discordId);
    const url = `http://localhost:3000/get-details?token=${data?.token}`
    return new NextResponse(JSON.stringify({ url }), { status: 200 })
}



