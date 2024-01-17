import { getUserByIdReqInfo } from "@/data/user";
import { NextResponse } from "next/server";



export async function GET(req: Request) {

    const id = req.url.split("referrers/")[1];

    try {
        const referrerDetail = await getUserByIdReqInfo(id);
        if (referrerDetail) {
            return new NextResponse(JSON.stringify({ referrerDetail }), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify({ error: "Referrer not found" }), {
                status: 403
            });
        }
    } catch (err) {
        return new NextResponse(JSON.stringify({ error: "Interner Server error" }), {
            status: 500
        });
    }

}



