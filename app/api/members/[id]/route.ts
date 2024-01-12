import { getMemberById } from "@/data/member";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";



export async function GET(req: Request) {

    const id = req.url.split("members/")[1];

    // if (typeof id !== 'string') {
    //     res.status(400).send({ error: 'Invalid ID format' });
    //     return;
    // }

    // console.log(id)

    try {
        const member = await getMemberById(id);
        if (member) {
            const response = { data: member.forms };
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



