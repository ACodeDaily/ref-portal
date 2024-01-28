"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Status, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { MemberRow } from "../_components/memberRow";


import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table"

import { useCurrentRole } from "@/src/hooks/use-currrent-role";

import { RoleGate } from "@/src/components/auth/role-gate";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";

interface member {
    id: string;
    name: string | null;
    email: string | null;
    codeForces: string | null;
    leetcode: string | null;
    codeForcesRating?: number;
}


const MemberPage = () => {

    const [members, setMembers] = useState<member[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/members'); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                const membersData = result.data || []; // Use an empty array as a default value if result.data is undefined or null

                const membersWithInfo: member[] = await fetchCodeforcesInfo(membersData);

                // Sort members based on Codeforces rating
                const sortedMembers = membersWithInfo.sort(
                    (a, b) => (b.codeForcesRating || 0) - (a.codeForcesRating || 0)
                );

                setMembers(sortedMembers);

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

    const deleteMemberData = (deletedMember: member) => {
        setMembers((prevMember) => {
            // Filter out the deleted form based on its id
            const updatedMembers = prevMember.filter((member) => member.id !== deletedMember.id);
            return updatedMembers;
        });
    };

    const fetchCodeforcesInfo = async (membersData: member[]): Promise<member[]> => {
        const handles = membersData.map((member) => member.codeForces).join(';');
        const apiUrl = `https://codeforces.com/api/user.info?handles=${handles}`;

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            if (result.status === 'OK') {
                // Extract Codeforces rating information from the API response
                const codeforcesInfo: member[] = result.result.map((userInfo: any) => {
                    const codeForcesRating = userInfo.rating || 0;

                    // Find the corresponding member in the original data
                    const member = membersData.find((m) => m.codeForces === userInfo.handle);

                    return {
                        ...member,
                        codeForcesRating,
                    };
                });

                return codeforcesInfo;
            } else {
                console.error('Codeforces API error:', result.comment);
                return membersData;
            }
        } catch (error) {
            console.error('Error fetching Codeforces data:', error);
            return membersData;
        }
    };


    return (

        <RoleGate allowedRole={[UserRole.ADMIN, UserRole.MOD, UserRole.REFERRER]}>
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
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead className="text-center">Email</TableHead>
                                <TableHead className="text-center"><Button variant="link">CodeForces</Button></TableHead>
                                <TableHead className="text-center"><Button variant="link">Leetcode</Button></TableHead>
                                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                                    <TableHead className="text-center">Action</TableHead>
                                </RoleGateForComponent>
                                <TableHead className="text-center">Show Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <MemberRow key={member.id} memberData={member} onUpdateMemberData={updateMemberData} onDeleteMemberData={deleteMemberData} />
                            ))}
                        </TableBody >
                    </Table>

                </CardContent>
            </Card >

        </RoleGate>
    );
};

export default MemberPage;