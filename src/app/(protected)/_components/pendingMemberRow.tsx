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
    forms?: form[]
}


interface memberRowDataProps {
    memberData: memberDataProps;
    onUpdateMemberData: (updateMemberData: memberDataProps) => void;
    onDeleteMemberData: (deleteMemberData: memberDataProps) => void;
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



export const PendingMemberRow = ({ memberData, onUpdateMemberData, onDeleteMemberData }: memberRowDataProps) => {
    const [isPending, startTransition] = useTransition()


    const onSubmitDelete = (id: string) => {

        startTransition(() => {
            memberDeleteWithForms(id)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }

                    if (data.success) {
                        toast.success(data.success);
                        onDeleteMemberData(data.deletedMember)

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }



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
                        {memberData.linkedIn &&
                            <Button variant={"link"}>

                                <Link href={memberData.linkedIn} target="__blank" style={{ marginLeft: '3px' }}>
                                    <FaLinkedin size={19} />
                                </Link>
                            </Button>
                        }
                    </TableCell>
                    {/* <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                        <TableCell className="text-center">

                            <DialogDemo
                                dialogTrigger="Delete"
                                dialogTitle="Delete member"
                                dialogDescription="Do you intend to remove the member along with all associated forms?"
                                ButtonLabel="yes"
                            >
                                <DialogFooter>
                                    <Button type="submit" variant="destructive" disabled={isPending} onClick={() => (onSubmitDelete(memberData.id))}>Yes</Button>
                                </DialogFooter>
                            </DialogDemo>

                        </TableCell>
                    </RoleGateForComponent> */}
                </TableRow>
            </TableBody>
        </Table>

    )
}

