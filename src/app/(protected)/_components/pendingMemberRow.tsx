"use client"
import Link from "next/link"
import { Button } from "@/src/components/ui/button";
import { Status } from "@prisma/client";
import { Table, TableBody, TableCell, TableRow, } from "@/src/components/ui/table"
import { useTransition } from "react";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { SiCodeforces } from "react-icons/si";
import { CiMail } from "react-icons/ci";

interface form {
    id: string;
    formId: string
    resume: string;
    message: string;
    organization: string;
    phoneNumber: string;
    cgpa: string;
    yoe: string;
    yog: string;
    jobId: string;
    status: Status;
    isGraduated?: boolean | null;
    verifiedBy?: string | null
    referrerResponse?: string | null
}


interface memberDataProps {
    id: string;
    name: string;
    email: string;
    codeForces: string;
    leetcode: string;
    linkedIn?: string | null;
    codeForcesRating?: number;
    forms?: form[] | any
}


interface memberRowDataProps {
    memberData: memberDataProps;
}


import * as React from "react"
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import { DialogDemo } from "@/src/components/dialog-demo";
import { DialogFooter } from "@/src/components/ui/dialog";
import { UserRole } from "@prisma/client";
import { memberDeleteWithForms } from "@/src/actions/member";
import { toast } from "sonner";


const copyToClipboard = async (text: string, type: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(`${type} copied to clipboard!`)
    } catch (error) {
        console.error('Error copying to clipboard:', error);
    }
};



export const PendingMemberRow = ({ memberData }: memberRowDataProps) => {
    const [isPending, startTransition] = useTransition()

    return (
        <Table>
            <TableBody>
                <TableRow key={memberData.id}>
                    <TableCell className="font-medium text-center">{`🧑‍🎓 ${memberData.name}`}</TableCell>
                    <TableCell className="text-center hover:cursor-pointer" onClick={() => copyToClipboard(memberData.email, "Email")}>
                        <Button variant={"link"}>
                            <CiMail size={17} />
                            <span style={{ marginLeft: '3px' }}>{`${memberData.email}`}</span>

                        </Button>
                    </TableCell>
                    <TableCell className="text-center">
                        <Button variant={"link"}>
                            <SiCodeforces size={17} />
                            <Link href={`https://codeforces.com/profile/${memberData.codeForces}`} target="__blank" style={{ marginLeft: '5px' }}>
                                {`${memberData.codeForces} ${memberData.codeForcesRating ? `(${memberData.codeForcesRating})` : ""}`}
                            </Link>
                        </Button>
                    </TableCell>
                    <TableCell className="text-center">
                        <Button variant={"link"}>
                            <SiLeetcode size={17} />
                            <Link href={`https://leetcode.com/${memberData.leetcode}`} target="__blank" style={{ marginLeft: '3px' }}>
                                {memberData.leetcode}
                            </Link>
                        </Button>
                    </TableCell>
                    <TableCell className="text-center">
                        <Button variant={"link"}>
                            <FaLinkedin size={19} />
                            <Link href={memberData.linkedIn ? memberData.linkedIn : "#"} target="__blank" style={{ marginLeft: '3px' }}>
                                {memberData.linkedIn ? "Link" : "Not Found"}
                            </Link>
                        </Button>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

    )
}

