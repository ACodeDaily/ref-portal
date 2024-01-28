"use client"
import Link from "next/link"
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import { Status, UserRole } from "@prisma/client";
import { toast } from "sonner";
import { TableCell, TableRow, } from "@/src/components/ui/table"
import { useTransition } from "react";
import { DialogDemo } from "@/src/components/dialog-demo";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/src/components/ui/select";

import { FaGoogleDrive } from "react-icons/fa";

import { BellIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/src/lib/utils"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog"

interface formDataProps {
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

interface formRowDataProps {
    formData: formDataProps;
    onUpdateFormData: (updateMemberData: formDataProps) => void;
    onDeleteFormData: (deleteFormData: formDataProps) => void;
}


import * as React from "react"
import { formUpdateSchema } from "@/src/schemas";
import { Input } from "@/src/components/ui/input";
import { formDelete, formUpdate } from "@/src/actions/formUpdate";
import { RoleGate } from "@/src/components/auth/role-gate";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"

interface referrerProps {
    id: string;
    name: string
    email: string;
    organization: string;
    isVerified: boolean;
    totalReferred: string;
}

interface referrerDataProps {
    id: string;
}

export const VerifierDetail = ({ id }: referrerDataProps) => {


    const [details, setDetails] = useState<referrerProps>();

    const fetchMemberForms = async (id: string | null) => {
        try {
            const response = await fetch(`/api/referrers/${id}`);
            const result = await response.json();

            if (result.referrerDetail !== undefined) {
                setDetails(result.referrerDetail);
            } else {
                console.error('No data received from the API');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };




    return (

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => { fetchMemberForms(id); }}>
                    Show Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Verifier Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this verifier
                    </DialogDescription>
                </DialogHeader>
                <CardContent className="grid gap-4">
                    <div className=" flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Name
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {details?.name}
                            </p>
                            <p className="text-sm font-medium leading-none">
                                Email
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {details?.email}
                            </p>
                            {/* <p className="text-sm font-medium leading-none">
                                Organization
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {details?.organization}
                            </p>
                            <p className="text-sm font-medium leading-none">
                                Verification Status
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {details?.isVerified ? "True" : "False"}
                            </p>
                            <p className="text-sm font-medium leading-none">
                                Total Referred
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {details?.totalReferred}
                            </p> */}
                        </div>
                    </div>

                </CardContent>
            </DialogContent>
        </Dialog >


    )
}

