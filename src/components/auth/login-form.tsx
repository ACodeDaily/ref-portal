"use client"

import * as z from "zod"

import { useState, useTransition } from "react"

import { useForm } from "react-hook-form"



import { zodResolver } from "@hookform/resolvers/zod"

import {
    Form, FormItem, FormLabel, FormControl, FormMessage, FormField
} from '@/src/components/ui/form'
import { LoginSchema } from "@/src/schemas"

import { CardWrapper } from "@/src/components/auth/card-wrapper"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { FormError } from "@/src/components/form-error"
import { FormSuccess } from "@/src/components/form-success"
import { login } from "@/src/actions/login"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";



export const LoginForm = () => {

    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : ""

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            login(values).then((data) => {
                if (data?.error) {
                    form.reset()
                    setError(data.error);
                }

                if (data?.success) {
                    form.reset();
                    setSuccess(data.success)
                }
                // TODO Add Success after 2FA

                if (data?.twoFactor) {
                    setShowTwoFactor(true)
                }
            })
                .catch(() => setError("Something went wrong"))
        })
    }

    const [passwordType, setPasswordType] = useState('password');

    return (
        <CardWrapper
            headerLabel="Welcome Back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
        // showSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">

                        {showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="123456"

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}


                        {!showTwoFactor && (<>

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
                                                placeholder="john.wick@action.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div
                                                style={{
                                                    position: 'relative'
                                                }}
                                            >
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="******"
                                                    type={passwordType}
                                                ></Input>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '25%',
                                                        right: '3%',
                                                        bottom: '20%'
                                                    }}
                                                >
                                                    {
                                                        passwordType === "text" ?
                                                            <FaRegEye
                                                                onClick={() => setPasswordType('password')}
                                                            />
                                                            :
                                                            <FaRegEyeSlash
                                                                onClick={() => setPasswordType('text')}
                                                            />
                                                    }
                                                </div>
                                            </div>
                                        </FormControl>
                                        <Button
                                            size="sm"
                                            variant="link"
                                            asChild
                                            className="px-0 font-normal"

                                        >
                                            <Link href="/auth/reset">
                                                Forgot password?
                                            </Link>
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>)}
                    </div>

                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        {showTwoFactor ? "Confirm" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}