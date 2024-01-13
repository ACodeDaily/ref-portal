import { getMemberWithFormByOrganization } from "@/data/member";
import { NextResponse } from "next/server";


export async function GET() {


    try {
        const organization = 'microsoft';

        const members = await getMemberWithFormByOrganization(organization);

        return new NextResponse(JSON.stringify(members), { status: 200 })
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: "Interner Server error" }), {
            status: 500
        });
    }
}



