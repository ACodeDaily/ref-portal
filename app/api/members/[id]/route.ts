import { getFormsByMemberIdWithOrganization } from "@/data/form";
import { NextResponse } from "next/server";



export async function GET(req: Request) {

    const id = req.url.split("members/")[1];

    try {
        const forms = await getFormsByMemberIdWithOrganization(id);
        if (forms) {
            const response = { data: forms };
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



