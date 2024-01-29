"use client"

import * as z from "zod"

import { useState, useTransition } from "react"

import { useForm } from "react-hook-form"



import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form, FormItem, FormLabel, FormControl, FormMessage, FormField
} from '@/src/components/ui/form'
import { ResetSchema } from "@/src/schemas"

import { CardWrapper } from "@/src/components/auth/card-wrapper"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { FormError } from "@/src/components/form-error"
import { FormSuccess } from "@/src/components/form-success"
import { reset } from "@/src/actions/reset"





export const ResetForm = () => {


    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");


        startTransition(() => {
            reset(values).then((data) => {
                setError(data?.error)
                // TODO Add Success after 2FA
                setSuccess(data?.success)
            })
        })
    }



    return (
        <CardWrapper
            headerLabel="Forgot your password?"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john.doe@email.com"
                                            type="email"
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
                        className="w-full"
                    >
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}