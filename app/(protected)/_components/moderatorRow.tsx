"use client"

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

import { TableCell, TableRow, } from "@/components/ui/table"
import { useTransition } from "react";
import { DialogDemo } from "@/components/dialog-demo";

import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, } from "@/components/ui/form";
import { useForm } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ModeratorUpdateSchema } from "@/schemas";
import { moderatorUpdate } from "@/actions/moderator";
import { ImCross } from "react-icons/im";
import { IoMdCheckmark } from "react-icons/io";


interface userProps {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    organization: string | null;
    isVerified: boolean;
    role: UserRole;
    isTwoFactorEnabled: boolean;
}

interface moderatorRowProps {
    userData: userProps;
    onUpdateUserData: (updateUserData: userProps) => void;
}


export const ModeratorRow = ({ userData, onUpdateUserData }: moderatorRowProps) => {

    const { id } = userData

    const form = useForm({
        defaultValues: {
            isVerified: userData?.isVerified,
            role: userData?.role || undefined,
        }
    });

    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof ModeratorUpdateSchema>) => {
        const combinedData = { ...values, id }
        startTransition(() => {
            moderatorUpdate(combinedData)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }

                    if (data.success) {
                        toast.success(data.success);
                        onUpdateUserData(data.updatedUser)

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }


    return (

        <TableRow key={userData.id}>
            <TableCell className="font-medium">{userData.name}</TableCell>
            <TableCell>{userData.email}</TableCell>
            <TableCell>{userData.organization ? userData.organization[0].toUpperCase() + userData.organization.slice(1) : "Default"}</TableCell>
            <TableCell>{userData.isVerified ? <IoMdCheckmark /> : <ImCross />}</TableCell>
            <TableCell>{userData.role}</TableCell>
            <TableCell className="text-right">
                <DialogDemo
                    dialogTrigger="Edit User"
                    dialogTitle="Edit User"
                    dialogDescription="Make changes to your profile here. Click save when you're done."
                    ButtonLabel="Save Changes"
                >

                    <Form {...form}>
                        <form
                            className="space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >

                            <FormField
                                control={form.control}
                                name="isVerified"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Verification Status</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
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
                                                <SelectItem value={UserRole.ADMIN}>
                                                    Admin
                                                </SelectItem>
                                                <SelectItem value={UserRole.MOD}>
                                                    Mod
                                                </SelectItem>
                                                <SelectItem value={UserRole.REFERRER}>
                                                    Referrer
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
            </TableCell>
        </TableRow>
    )
}

