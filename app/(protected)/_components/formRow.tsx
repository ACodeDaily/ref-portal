"use client"
import Link from "next/link"
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Status, UserRole } from "@prisma/client";
import { toast } from "sonner";
import { TableCell, TableRow, } from "@/components/ui/table"
import { useTransition } from "react";
import { DialogDemo } from "@/components/dialog-demo";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

import { FaGoogleDrive } from "react-icons/fa";

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
import { formUpdateSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { formDelete, formUpdate } from "@/actions/formUpdate";
import { RoleGate } from "@/components/auth/role-gate";
import { DialogFooter } from "@/components/ui/dialog";
import { RoleGateForComponent } from "@/components/auth/role-gate-component";


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




    return (

        <TableRow key={formData.id}>
            <TableCell className="font-medium">{formData.organization}</TableCell>
            <TableCell>{formData.jobId}</TableCell>
            <TableCell> {formData.phoneNumber}</TableCell>
            <TableCell> {formData.cgpa}</TableCell>
            <TableCell> {formData.yoe}</TableCell>
            <TableCell>{formData.message} </TableCell>
            <TableCell><Button variant={"link"}><Link href={`${formData.resume}`} target="__blank"><FaGoogleDrive /></Link></Button> </TableCell>
            <TableCell>{formData.status} </TableCell>

            <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                <TableCell>{formData.verifiedBy ? formData.verifiedBy : "Unverified"}</TableCell>
            </RoleGateForComponent>

            <TableCell className="text-right">
                
                <RoleGateForComponent allowedRole={[UserRole.ADMIN]}>
                    <DialogDemo
                        dialogTrigger="Delete"
                        dialogTitle="Delete Form"
                        dialogDescription="Do you want to delete this form?"
                        ButtonLabel="yes"
                    >
                        <DialogFooter>
                            <Button type="submit" onClick={onSubmitDelete}>Yes</Button>
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
                                                        <SelectValue placeholder="Select a role" />
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
                                <Button type="submit">Save Changes</Button>
                            </form>
                        </Form>

                    </DialogDemo>
                </RoleGateForComponent>


            </TableCell>
        </TableRow>
    )
}

