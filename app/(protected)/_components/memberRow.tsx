"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button";

import { TableCell, TableRow, } from "@/components/ui/table"
import { useTransition } from "react";




interface memberDataProps {
    id: string;
    name: string | null;
    email: string | null;
    codeForces: string | null;
    leetcode: string | null;
}


interface memberRowDataProps {
    memberData: memberDataProps;
    onUpdateMemberData: (updateMemberData: memberDataProps) => void;
    onDeleteMemberData: (deleteMemberData: memberDataProps) => void;
}


import * as React from "react"
import { RoleGateForComponent } from "@/components/auth/role-gate-component";
import { DialogDemo } from "@/components/dialog-demo";
import { DialogFooter } from "@/components/ui/dialog";
import { UserRole } from "@prisma/client";
import { memberDeleteWithForms } from "@/actions/member";
import { toast } from "sonner";






export const MemberRow = ({ memberData, onUpdateMemberData, onDeleteMemberData }: memberRowDataProps) => {
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

        <TableRow key={memberData.id}>
            <TableCell className="font-medium text-center">{memberData.name}</TableCell>
            <TableCell className="text-center">{memberData.email}</TableCell>
            <TableCell className="text-center"><Button variant={"link"}><Link href={`https://codeforces.com/profile/${memberData.codeForces}`} target="__blank">{memberData.codeForces}</Link></Button> </TableCell>
            <TableCell className="text-center"><Button variant={"link"}><Link href={`https://leetcode.com/${memberData.leetcode}`} target="__blank">{memberData.leetcode}</Link></Button> </TableCell>
            <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                <TableCell className="text-center">

                    <DialogDemo
                        dialogTrigger="Delete"
                        dialogTitle="Delete member"
                        dialogDescription="Do you intend to remove the member along with all associated forms?"
                        ButtonLabel="yes"
                    >
                        <DialogFooter>
                            <Button type="submit" variant="destructive" onClick={() => (onSubmitDelete(memberData.id))}>Yes</Button>
                        </DialogFooter>
                    </DialogDemo>

                </TableCell>
            </RoleGateForComponent>

            <TableCell className="text-center">

                <Button variant="outline"> <Link href={`/member/detail?id=${memberData.id}`}>Get Detail</Link></Button>
            </TableCell>
        </TableRow>
    )
}

