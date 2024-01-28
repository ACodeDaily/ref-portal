"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, use } from "react";
import { useSession } from "next-auth/react";
import { SettingSchema } from "@/src/schemas";

import { Card, CardHeader, CardContent, } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { settings } from "@/src/actions/settings";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage, } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { useCurrentUser } from "@/src/hooks/use-current-user";
import { FormError } from "@/src/components/form-error";
import { FormSuccess } from "@/src/components/form-success";
import { Label } from "@/src/components/ui/label";

const SettingsPage = () => {

    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SettingSchema>>({
        resolver: zodResolver(SettingSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
        }
    });

    const onSubmit = (values: z.infer<typeof SettingSchema>) => {
        startTransition(() => {
            settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error);
                    }

                    if (data.success) {
                        update();
                        setSuccess(data.success);
                    }
                })
                .catch(() => setError("Something went wrong!"));
        });
    }

    return (
        <Card className="w-[90%]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️ Settings
                </p>
            </CardHeader>
            <CardContent>

                <Label className="space-y-2">Name</Label>
                <Input className="space-y-2" value={user?.name || ""} disabled={true} />

                <Label className="space-y-2">Email</Label>
                <Input className="space-y-2" value={user?.email || ""} disabled={true} />

                <Label className="space-y-2">Role</Label>
                <Input className="space-y-2" value={user?.role || ""} disabled={true} />

                <Label className="space-y-2">Organization</Label>
                <Input className="space-y-2" value={user?.organization || ""} disabled={true} />



                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            disabled={isPending}
                            type="submit"
                        >
                            Update
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default SettingsPage;

