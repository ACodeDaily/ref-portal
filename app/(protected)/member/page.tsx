"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Status } from "@prisma/client";
import { useEffect, useState } from "react";
import { MemberRow } from "../_components/memberRow";


import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useCurrentRole } from "@/hooks/use-currrent-role";

interface member {
    id: string;
    name: string | null;
    email: string | null;
    codeForces: string | null;
    leetcode: string | null;
}


const MemberPage = () => {

    const [members, setMembers] = useState<member[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/members'); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                setMembers(result.data || []); // Use an empty array as a default value if result.data is undefined or null
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const updateMemberData = (updatedMemberData: member) => {
        setMembers((prevMember) =>
            prevMember.map((member) =>
                member.id === updatedMemberData.id ? { ...updatedMemberData } : updatedMemberData
            )
        );
    }

    return (
        <Card className="w-[90%]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🧑‍🎓 Members
                </p>
            </CardHeader>
            <CardContent className="space-y-4">


                <Table>
                    <TableCaption>End of list</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead><Button variant="link">CodeForces</Button></TableHead>
                            <TableHead><Button variant="link">Leetcode</Button></TableHead>
                            <TableHead className="text-right">Show Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <MemberRow memberData={member} onUpdateMemberData={updateMemberData} />
                        ))}
                    </TableBody >
                </Table>




            </CardContent>
        </Card >
    );
};

export default MemberPage;