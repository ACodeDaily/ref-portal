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
import { FaDownload } from "react-icons/fa6";

interface formDataProps {
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

interface formRowDataProps {
    formData: formDataProps;
    onUpdateFormData: (updatedFormData: formDataProps) => void;
    onDeleteFormData: (deletedForm: formDataProps) => void;
}


import * as React from "react"
import { formUpdateSchema } from "@/src/schemas";
import { Input } from "@/src/components/ui/input";
import { formDelete, formUpdate } from "@/src/actions/formUpdate";
import { DialogFooter } from "@/src/components/ui/dialog";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import { VerifierDetail } from "./verifierDetail";


export const FormRow = ({ formData, onUpdateFormData, onDeleteFormData }: formRowDataProps) => {

    const { id } = formData


    const form = useForm({
        defaultValues: {
            referrerResponse: formData?.referrerResponse || "",
            status: formData?.status || Status.PENDING,
        }
    });

    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof formUpdateSchema>) => {
        const combinedData = { ...values, id }
        startTransition(() => {
            formUpdate(combinedData)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }

                    if (data.success) {
                        toast.success(data.success);
                        onUpdateFormData(data.updatedForm)

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }

    const onSubmitDelete = () => {

        startTransition(() => {
            formDelete(id)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }

                    if (data.success) {
                        toast.success(data.success);
                        onDeleteFormData(data.deletedForm)

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }

    const copyToClipboard = async (text: string, type: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${type} copied to clipboard!`)
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    };

    const getIdFromUrl = (url: string) => {

        const id = url.match(/[-\w]{25,}/);
        return id;
    }

    const statusColorClass =
        formData.status === Status.ACCEPTED
            ? 'bg-green-400'
            : formData.status === Status.REJECTED
                ? 'bg-red-300'
                : 'bg-gray-100';


    return (

        <TableRow key={formData.id} className={statusColorClass} style={{height: '1rem'}}>
            <TableCell className="font-medium text-center">{formData.organization}</TableCell>
            <TableCell className="text-center hover:cursor-pointer" onClick={() => copyToClipboard(formData.jobId, "Job Id")}>{formData.jobId}</TableCell>
            <TableCell className="text-center hover:cursor-pointer" onClick={() => copyToClipboard(formData.phoneNumber, "Phone Number")}> {formData.phoneNumber}</TableCell>
            <TableCell className="text-center hover:cursor-pointer" onClick={() => copyToClipboard(formData.cgpa, "CGPA")}> {formData.cgpa}</TableCell>
            <TableCell className="text-center hover:cursor-pointer" onClick={() => copyToClipboard(formData.yoe, "Year of Experience")}> {formData.yoe}</TableCell>
            <TableCell className="text-center hover:cursor-pointer" onClick={() => copyToClipboard(formData.yog, "Year of Graduation")}> {formData.yog}</TableCell>

            {
                formData.isGraduated === null ?
                    <TableCell className="text-center hover:cursor-pointer"> Not Available</TableCell> :
                    <TableCell className="text-center hover:cursor-pointer"> {formData.isGraduated ? "Yes" : "No"} </TableCell>
            }

            <TableCell className="text-center hover:cursor-pointer" style={{height: '1rem'}}>
                <DialogDemo
                    dialogTrigger="Message"
                    dialogTitle="Message"
                    dialogDescription="Key message from Candidate"
                    ButtonLabel="yes"
                >
                    {formData.message ? <p>{formData.message} </p> : <p>No Message</p>}
                </DialogDemo>
            </TableCell>

            <TableCell className="flex justify-around items-center">

                <Button variant={"link"}><Link href={`${formData.resume}`} target="__blank"><FaGoogleDrive /></Link></Button>

                <FaDownload className="hover:cursor-pointer" onClick={(e: React.MouseEvent) => { window.open(`https://drive.google.com/u/1/uc?id=${getIdFromUrl(formData.resume)}&export=download`, "_blank"); }} />

            </TableCell>

            <TableCell className="text-center">{formData.status} </TableCell>
            <TableCell className="text-center">
                <DialogDemo
                    dialogTrigger="Response"
                    dialogTitle="Response"
                    dialogDescription="Key note from referrer side"
                    ButtonLabel="yes"
                >
                    {formData.referrerResponse ? <p>{formData.referrerResponse} </p> : <p>No Response</p>}

                </DialogDemo>
            </TableCell>

            <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>



                <TableCell className="text-center">{formData.verifiedBy ? <VerifierDetail id={formData.verifiedBy} /> : <Button variant="ghost">
                    Unverified
                </Button>}</TableCell>

            </RoleGateForComponent>

            <TableCell className="text-center">

                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                    <DialogDemo
                        dialogTrigger="Delete"
                        dialogTitle="Delete Form"
                        dialogDescription="Do you want to delete this form?"
                        ButtonLabel="yes"
                    >
                        <DialogFooter>
                            <Button type="submit" variant="destructive" onClick={onSubmitDelete} disabled={isPending}>Yes</Button>
                        </DialogFooter>
                    </DialogDemo>

                </RoleGateForComponent>

                <RoleGateForComponent allowedRole={[UserRole.REFERRER]}>
                    <DialogDemo
                        dialogTrigger="Update"
                        dialogTitle="Update details"
                        dialogDescription="Give feedback and reponse from your side."
                        ButtonLabel="Save Changes"
                    >

                        <Form {...form}>
                            <form
                                className="space-y-6"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >

                                <FormField
                                    control={form.control}
                                    name="referrerResponse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Response</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Response form referrer side"

                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Action" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={Status.PENDING}>
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value={Status.ACCEPTED}>
                                                        Accepted
                                                    </SelectItem>
                                                    <SelectItem value={Status.REJECTED}>
                                                        Rejected
                                                    </SelectItem>

                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isPending}>Save Changes</Button>
                            </form>
                        </Form>

                    </DialogDemo>
                </RoleGateForComponent>


            </TableCell>
        </TableRow >
    )
}

