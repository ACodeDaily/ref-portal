"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Status, UserRole } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"



import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { FormRow } from "../../_components/formRow";
import { RoleGate } from "@/components/auth/role-gate";
import { RoleGateForComponent } from "@/components/auth/role-gate-component";

interface form {
    id: string;
    formId: string
    resume: String;
    message: String;
    organization: String;
    phoneNumber: String;
    cgpa: String;
    yoe: String;
    jobId: String;
    status: Status;
    verifiedBy?: string | null
    referrerResponse?: string | null
}

const MemberPage = () => {

    const [forms, setForms] = useState<form[]>([]);

    const searchParams = useSearchParams();
    const id = searchParams.get("id");


    useEffect(() => {
        const fetchMemberForms = async (id: string | null) => {
            try {
                const response = await fetch(`/api/members/${id}`); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                setForms(result.data || []); // Use an empty array as a default value if result.data is undefined or null
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchMemberForms(id);
    }, []);


    const updateFormData = (updatedFormData: form) => {
        setForms((prevForm) =>
            prevForm.map((form) =>
                form.id === updatedFormData.id ? { ...updatedFormData } : form
            )
        );
    }

    const deleteFormData = (deletedForm: form) => {
        setForms((prevForms) => {
            // Filter out the deleted form based on its id
            const updatedForms = prevForms.filter((form) => form.id !== deletedForm.id);
            return updatedForms;
        });
    };


    return (
        <RoleGate allowedRole={[UserRole.ADMIN, UserRole.MOD, UserRole.REFERRER]}>
            <Card className="w-[90%]">
                <CardHeader>
                    <p className="text-2xl font-semibold text-center">
                        📄 Forms
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">


                    <Table>
                        <TableCaption>End of list</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organization</TableHead>
                                <TableHead>Job Id</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>CGPA</TableHead>
                                <TableHead>{"Exp(year)"}</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead><Button variant="link">Resume</Button></TableHead>
                                <TableHead>Status</TableHead>
                                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                                    <TableHead>Verified By</TableHead>
                                </RoleGateForComponent>
                                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.REFERRER]}>
                                    <TableHead className="text-right">Action</TableHead>
                                </RoleGateForComponent>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {forms.map((forms) => (
                                <FormRow formData={forms} onUpdateFormData={updateFormData} onDeleteFormData={deleteFormData} />
                            ))}
                        </TableBody >
                    </Table>

                </CardContent>
            </Card >
        </RoleGate>
    );
};

export default MemberPage;