"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button";

import { TableCell, TableRow, } from "@/components/ui/table"



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
}


import * as React from "react"





export const MemberRow = ({ memberData, onUpdateMemberData }: memberRowDataProps) => {


    return (

        <TableRow key={memberData.id}>
            <TableCell className="font-medium">{memberData.name}</TableCell>
            <TableCell>{memberData.email}</TableCell>
            <TableCell><Button variant={"link"}><Link href={`https://codeforces.com/profile/${memberData.codeForces}`} target="__blank">{memberData.codeForces}</Link></Button> </TableCell>
            <TableCell><Button variant={"link"}><Link href={`https://leetcode.com/${memberData.leetcode}`} target="__blank">{memberData.leetcode}</Link></Button> </TableCell>
            <TableCell className="text-right">

                <Button variant="outline"> <Link href={`/member/detail?id=${memberData.id}`}>Get Detail</Link>s</Button>
            </TableCell>
        </TableRow>
    )
}

