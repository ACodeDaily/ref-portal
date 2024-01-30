"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
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
} from "@/src/components/ui/table"

import { FormRow } from "../../_components/formRow";
import { RoleGate } from "@/src/components/auth/role-gate";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import PageLoader from "@/src/components/loader";

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
    verifiedBy?: string | null
    referrerResponse?: string | null
}

const MemberPage = () => {

    const [forms, setForms] = useState<form[]>([]);

    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [loadingForms, setLoadingForms] = useState(true)


    useEffect(() => {
        const fetchMemberForms = async (id: string | null) => {
            try {
                const response = await fetch(`/api/members/${id}`); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                setForms(result.data || []); // Use an empty array as a default value if result.data is undefined or null
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingForms(false);
            }
        };

        fetchMemberForms(id);
    }, [id]);


    const updateFormData = (updatedFormData: form) => {
        setForms((prevForm) =>
            prevForm.map((form) =>
                form.id === updatedFormData.id ? { ...updatedFormData } : form
            )
        );
    }

    const deleteFormData = (deletedForm: form) => {
        setForms((prevForms) => {
            const updatedForms = prevForms.filter((form) => form.id !== deletedForm.id);
            return updatedForms;
        });
    };



    return (
        <>
            <PageLoader loading={loadingForms} />

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
                                    <TableHead className="text-center">Organization</TableHead>
                                    <TableHead className="text-center">Job Id</TableHead>
                                    <TableHead className="text-center">Phone Number</TableHead>
                                    <TableHead className="text-center">CGPA</TableHead>
                                    <TableHead className="text-center">{"Exp(year)"}</TableHead>
                                    <TableHead className="text-center">{"Grad. Year"}</TableHead>
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
                                {forms.map((form) => (
                                    <FormRow key={form.id} formData={form} onUpdateFormData={updateFormData} onDeleteFormData={deleteFormData} />
                                ))}
                            </TableBody >
                        </Table>

                    </CardContent>
                </Card >
            </RoleGate>
        </>

    );
};

export default MemberPage;