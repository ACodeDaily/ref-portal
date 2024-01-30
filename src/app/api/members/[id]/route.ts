import { getFormsByMemberIdWithOrganization } from "@/src/data/form";
import { NextResponse } from "next/server";



export async function GET(req: Request) {

    const id = req.url.split("members/")[1];

    try {
        const data = await getFormsByMemberIdWithOrganization(id);
        if (data) {
            const response = { data: data };
            return new NextResponse(JSON.stringify(response), { status: 200 })
        } else {
            return new NextResponse(JSON.stringify({ error: "Member not found" }), {
                status: 403
            });
        }
    } catch (err) {
        return new NextResponse(JSON.stringify({ error: "Interner Server error" }), {
            status: 500
        });
    }

}



