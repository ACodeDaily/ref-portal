"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Status } from "@prisma/client";
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

    return (
        <Card className="w-[90%]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🔑 Admin
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
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {forms.map((forms) => (
                            <FormRow formData={forms} onUpdateFormData={updateFormData} />
                        ))}
                    </TableBody >
                </Table>

            </CardContent>
        </Card >
    );
};

export default MemberPage;