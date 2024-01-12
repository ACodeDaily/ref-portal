"use server";

import * as z from "zod"
import { DetailSchema } from "@/schemas"
import { db } from "@/lib/db";
import { Status } from "@prisma/client";
import { getMemberbyCodeForcesId } from "@/data/member";



export const sendDetails = async (values: z.infer<typeof DetailSchema>) => {
    const validatedFields = DetailSchema.safeParse(values)

    if (!validatedFields.success) {
        return {
            error: "Invalid Fields"
        }
    }

    const { email, name, codeForces, leetcode, resume, message, organization, phoneNumber, cgpa, yoe, jobId } = validatedFields.data;


    const existingMember = await getMemberbyCodeForcesId(codeForces)

    if (existingMember) {
        await db.form.create({
            data: {
                formId: existingMember.id,
                resume,
                message,
                organization,
                phoneNumber,
                cgpa,
                yoe,
                jobId,
                status: Status.PENDING,
            },
        });
    } else {

        await db.member.create({
            data: {
                email, name, codeForces, leetcode,
                forms: {
                    create: {
                        resume, message, organization, phoneNumber, cgpa, yoe, jobId, status: Status.PENDING
                    }
                }
            },
        });
    }

    // TODO: Send Verification token email

    return { success: "Details Submitted Successfully" }
}
