"use client"
import * as z from "zod";

import { UserButton } from '@/src/components/ui/user-button'
import { Button } from '@/src/components/ui/button'
import { useCurrentRole } from '@/src/hooks/use-currrent-role'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useTransition } from "react";
import Image from "next/image";
import { RoleGateForComponent } from '@/src/components/auth/role-gate-component'
import { DialogDemo } from "@/src/components/dialog-demo";
import { Form, FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, } from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { toast } from "sonner";


import { organizationAddSchema } from "@/src/schemas";
import { organizationAddition } from "@/src/actions/organization";






const Navbar = () => {

    const form = useForm({
        defaultValues: {
            name: "",
        }
    });

    const [isPending, startTransition] = useTransition()

    const onSubmit = (values: z.infer<typeof organizationAddSchema>) => {
        startTransition(() => {
            organizationAddition(values)
                .then((data) => {
                    if (data.error) {
                        form.reset();
                        toast.error(data.error);
                    }

                    if (data.success) {
                        form.reset();
                        toast.success(data.success);

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }



    const pathname = usePathname();
    return (
        <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[90%] shadow-sm'>
            <div className='flex gap-x-2'>

                <div className='mt-[-1px]'>
                    <Image
                        // onClick={() => router.push('/')}
                        src="/images/TextLogo.png"
                        height="80"
                        width="80"
                        alt="Logo"
                    />
                </div>

                <Button
                    asChild
                    variant={pathname === "/member" ? "default" : "outline"}
                >
                    <Link href="/member">Members</Link>
                </Button>


                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                    <Button
                        asChild
                        variant={pathname === "/referrer" ? "default" : "outline"}
                    >
                        <Link href="/referrer">Referrer</Link>
                    </Button>
                </RoleGateForComponent>

                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                    <Button
                        asChild
                        variant={pathname === "/request" ? "default" : "outline"}
                    >
                        <Link href="/request">Requests</Link>
                    </Button>
                </RoleGateForComponent>

                <RoleGateForComponent allowedRole={[UserRole.ADMIN]}>
                    <Button
                        asChild
                        variant={pathname === "/moderator" ? "default" : "outline"}
                    >
                        <Link href="/moderator">Moderator</Link>
                    </Button>
                </RoleGateForComponent>

                <Button
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                >
                    <Link href="/settings">Settings</Link>
                </Button>


            </div>
            <div className="flex justify-between gap-x-2">

                <RoleGateForComponent allowedRole={[UserRole.ADMIN]}>
                    <Button
                        asChild
                        variant={pathname === "/organizations" ? "default" : "outline"}
                    >
                        <Link href="/organizations">Organizations</Link>
                    </Button>
                </RoleGateForComponent>

                <RoleGateForComponent allowedRole={[UserRole.ADMIN]}>
                    <Button
                        asChild
                    >
                        <DialogDemo
                            dialogTrigger="Add Organization"
                            dialogTitle="New Organization Addition"
                            dialogDescription="give organization name and click add organization"
                        >

                            <Form {...form}>
                                <form
                                    className="space-y-6"
                                    onSubmit={form.handleSubmit(onSubmit)}
                                >

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Organization</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="enter organization name"

                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <Button type="submit" disabled={isPending}>Add Organization</Button>
                                </form>
                            </Form>

                        </DialogDemo>

                    </Button>
                </RoleGateForComponent>
                <UserButton />
            </div>

        </nav >
    )
}

export default Navbar

