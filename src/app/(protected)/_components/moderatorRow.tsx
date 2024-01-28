"use client"

import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

import { TableCell, TableRow, } from "@/src/components/ui/table"
import { useTransition } from "react";
import { DialogDemo } from "@/src/components/dialog-demo";

import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { ModeratorUpdateSchema } from "@/src/schemas";
import { moderatorUpdate } from "@/src/actions/moderator";
import { ImCross } from "react-icons/im";
import { IoMdCheckmark } from "react-icons/io";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import { userDelete } from "@/src/actions/user";
import { DialogFooter } from "@/src/components/ui/dialog";
import { VerifierDetail } from "./verifierDetail";


interface userProps {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    organization: string | null;
    isVerified: boolean;
    verifiedBy: string | null
    role: UserRole;
    isTwoFactorEnabled: boolean;
}

interface moderatorRowProps {
    userData: userProps;
    onUpdateUserData: (updateUserData: userProps) => void;
    onDeleteUserData: (deleteUserData: userProps) => void;
}


export const ModeratorRow = ({ userData, onUpdateUserData, onDeleteUserData }: moderatorRowProps) => {

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

    const onSubmitDelete = () => {
        startTransition(() => {
            userDelete(id)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }

                    if (data.success) {
                        toast.success(data.success);
                        onDeleteUserData(data.deletedUser)

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }

    return (

        <TableRow key={userData.id}>
            <TableCell className="text-center font-medium">{userData.name}</TableCell>
            <TableCell className="text-center">{userData.email}</TableCell>
            <TableCell className="text-center">{userData.organization ? userData.organization[0].toUpperCase() + userData.organization.slice(1) : "Default"}</TableCell>
            <TableCell className="text-center">{userData.isVerified ? <IoMdCheckmark /> : <ImCross />}</TableCell>
            <TableCell className="text-center">{userData.role}</TableCell>

            <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>

                <TableCell className="text-center">{userData.verifiedBy ? <VerifierDetail id={userData.verifiedBy} /> : <Button variant="ghost">
                    Unverified
                </Button>}</TableCell>

            </RoleGateForComponent>

            <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                <TableCell className="text-center">
                    <DialogDemo
                        dialogTrigger="Delete"
                        dialogTitle="Delete User"
                        dialogDescription="Do you want to delete this User?"
                        ButtonLabel="yes"
                    >
                        <DialogFooter>
                            <Button type="submit" variant="destructive" disabled={isPending} onClick={onSubmitDelete}>Yes</Button>
                        </DialogFooter>
                    </DialogDemo>

                </TableCell>
            </RoleGateForComponent>

            <TableCell className="text-center">
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
                                                <RoleGateForComponent allowedRole={[UserRole.ADMIN]}>
                                                    <SelectItem value={UserRole.ADMIN}>
                                                        Admin
                                                    </SelectItem>
                                                </RoleGateForComponent>

                                                <RoleGateForComponent allowedRole={[UserRole.ADMIN]}>
                                                    <SelectItem value={UserRole.MOD}>
                                                        Mod
                                                    </SelectItem>
                                                </RoleGateForComponent>

                                                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                                                    <SelectItem value={UserRole.REFERRER}>
                                                        Referrer
                                                    </SelectItem>
                                                </RoleGateForComponent>

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
            </TableCell>
        </TableRow>
    )
}

