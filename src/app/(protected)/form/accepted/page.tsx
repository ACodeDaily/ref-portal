"use client";
import { Status, UserRole } from "@prisma/client";
import { currentRole, currentUser } from "@/src/lib/auth";

import { useEffect, useState } from "react";

import { RoleGate } from "@/src/components/auth/role-gate";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import PageLoader from "@/src/components/loader";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MemberRow } from "../../_components/pendingRow";
import { FormRow } from "../../_components/formRow";
import { PendingMemberRow } from "../../_components/pendingMemberRow";
import { PendingFormRow } from "../../_components/pendingFormRow";
import { usePathname } from "next/navigation";
import Link from "next/link";
import FormNavbar from "../../_components/formNavbar";


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

interface member {
    id: string;
    name: string;
    email: string;
    codeForces: string;
    leetcode: string;
    linkedIn?: string | null;
    codeForcesRating?: number;
    forms?: form[];
}

interface formRowDataProps {
    formData: form;
    role: any
}


const PendingRequestsPage = () => {
    const [members, setMembers] = useState<Array<[member, form]>>([]);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [userRole, setUserRole] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch('/api/form/accepted'); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                const membersData = result.data || []; // Use an empty array as a default value if result.data is undefined or null
                const role = result.role;
                setUserRole(role);
                const user = result.user;
                const membersWithInfo: member[] = await fetchCodeforcesInfo(membersData);

                // Sort members based on Codeforces rating
                const sortedMembers = membersWithInfo.sort(
                    (a, b) => (b.codeForcesRating || 0) - (a.codeForcesRating || 0)
                );

                let temp: Array<[member, form]> = []

                for (const member of sortedMembers) {
                    if (member.forms && Array.isArray(member.forms)) {
                        for (const form of member.forms) {
                            if (role === 'REFERRER' && form.organization === user?.organization && form.status === "ACCEPTED") {
                                temp.push([member, form]);
                            }
                            else if ((role === 'ADMIN' || role === 'MOD') && form.status === "ACCEPTED") {
                                temp.push([member, form]);
                            }
                        }
                    }
                }

                setMembers(temp);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingMembers(false);
            }
        }

        fetchData();

    }, []);

    const fetchCodeforcesInfo = async (membersData: member[]): Promise<member[]> => {
        const handles = membersData.map((member) => member.codeForces).join(';');
        const apiUrl = `https://codeforces.com/api/user.info?handles=${handles}`;
        // const apiUrl = `https://random-data-api.com/api/v2/users?size=2`;

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

    const updateMemberData = (updatedMemberData: member) => {
        let temp: Array<[member, form]> = []
        for (let i = 0; i < members.length; i++) {
            if (members[i][0].id === updatedMemberData.id) {
                temp.push([updatedMemberData, members[i][1]]);
            }
            else {
                temp.push(members[i]);
            }
        }
        setMembers(temp);
    }

    const updateFormData = (updatedFormData: form) => {
        let temp: Array<[member, form]> = []
        for (let i = 0; i < members.length; i++) {
            if (members[i][1].id === updatedFormData.id) {
                if(updatedFormData.status === Status.ACCEPTED) {
                    temp.push([members[i][0], updatedFormData]);
                }
            }
            else {
                temp.push(members[i]);
            }
        }
        setMembers(temp);
    }

    const deleteFormData = (deletedForm: form) => {
        let temp: Array<[member, form]> = []
        for (let i = 0; i < members.length; i++) {
            if (members[i][1].id === deletedForm.id) {

            }
            else {
                temp.push(members[i]);
            }
        }
        setMembers(temp);
    };

    const deleteMemberData = (deletedMember: member) => {
        let temp: Array<[member, form]> = []
        for (let i = 0; i < members.length; i++) {
            if (members[i][0].id === deletedMember.id) {

            }
            else {
                temp.push(members[i]);
            }
        }
        setMembers(temp);
    };
    const pathname = usePathname();
    return (
        <>
            <PageLoader loading={loadingMembers} />

            <RoleGate allowedRole={[UserRole.ADMIN, UserRole.MOD, UserRole.REFERRER]}>
                <Card className="w-[90%]">
                    <CardHeader className="bg-secondary rounded-xl">
                        <FormNavbar />
                    </CardHeader>
                </Card>
                <div className="w-[90%] flex flex-col justify-center">
                    {members.map((member, i) => {
                        return (
                            <Card key={i} className="w-[100%] mb-3 flex flex-col justify-center">
                                <CardContent className="flex flex-col justify-center">
                                    <PendingMemberRow key={member[0].id} memberData={member[0]} onUpdateMemberData={updateMemberData} onDeleteMemberData={deleteMemberData} />
                                    <div className="flex flex-col justify-center">
                                        <div>
                                            <Table style={{ fontSize: '0.8rem', overflowX: 'visible' }}>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="text-center">Organization</TableHead>
                                                        <TableHead className="text-center">Job Id</TableHead>
                                                        <TableHead className="text-center">Phone Number</TableHead>
                                                        <TableHead className="text-center">CGPA</TableHead>
                                                        <TableHead className="text-center">{"Exp(year)"}</TableHead>
                                                        <TableHead className="text-center">{"Grad. Year"}</TableHead>
                                                        <TableHead className="text-center">{"Grad. Status"}</TableHead>
                                                        <TableHead className="text-center">Message</TableHead>
                                                        <TableHead className="text-center"><Button variant="link">Resume</Button></TableHead>
                                                        <TableHead className="text-center">Status</TableHead>
                                                        <TableHead className="text-center">Response</TableHead>
                                                        <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                                                            <TableHead className="text-center">Verified By</TableHead>
                                                        </RoleGateForComponent>
                                                        <TableHead className="text-center">Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <PendingFormRow key={member[1].id} formData={member[1]} onUpdateFormData={updateFormData} onDeleteFormData={deleteFormData} />
                                                </TableBody >
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </RoleGate>
        </>
    )
};

export default PendingRequestsPage;