
"use client"

import * as z from "zod"

import { useEffect, useState, useTransition } from "react"

import { useForm } from "react-hook-form"



import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Header } from "@/src/components/auth/header";



import {
    Form, FormItem, FormLabel, FormControl, FormMessage, FormField
} from '@/src/components/ui/form'
import { DetailSchema } from "@/src/schemas"

import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { FormError } from "@/src/components/form-error"
import { FormSuccess } from "@/src/components/form-success"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { sendDetails } from "@/src/actions/send-details"
import { useSearchParams } from "next/navigation"
import { Textarea } from "./ui/textarea"

import PageLoader from "./loader"



interface organization {
    id: string;
    name: string
    normalizedLowerCase: string;
}

const GetDetailsForm = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof DetailSchema>>({
        resolver: zodResolver(DetailSchema),
        defaultValues: {
            email: "",
            name: "",
            codeForces: "",
            leetcode: "",
            resume: "",
            message: "",
            organization: "",
            phoneNumber: "",
            cgpa: "",
            yoe: "",
            yog: "",
            jobId: "",
        }
    });


    const [organizations, setOrganizations] = useState<organization[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/organizations', { next: { revalidate: 10 } }); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                setOrganizations(result.data || []); // Use an empty array as a default value if result.data is undefined or null
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingOrganizations(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = (values: z.infer<typeof DetailSchema>) => {
        setError("");
        setSuccess("");


        startTransition(() => {
            sendDetails(values, token).then((data) => {
                if (data?.error) {
                    setError(data.error)
                }
                if (data?.success) {
                    form.reset()
                    setSuccess(data.success)
                }
            })
        })
    }

    const [isLoadingOrganizations, setLoadingOrganizations] = useState(true);


    return (
        <>
            <PageLoader loading={isLoadingOrganizations} />
            <Card className="w-[60%] shadow-md justify-center items-center">
                <CardHeader>
                    <Header label="Submit your details" />
                </CardHeader>

                <CardContent className="w-full flex flex-col gap-y-4 items-center justify-center">


                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <div className="space-y-1">
                                <div className="flex flex-row gap-x-2 justify-between">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="John Wick"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

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
                                                        placeholder="john.wick@assassin.com"
                                                        type="email"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-row gap-x-2 justify-between">
                                    <FormField
                                        control={form.control}
                                        name="codeForces"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CodeForces</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="BabaYaga"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="leetcode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Leetcode</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="BabaYaga"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-row gap-x-2 justify-between">
                                    <FormField
                                        control={form.control}
                                        name="resume"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Resume Link</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="drive.google.com"
                                                        type="link"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="jobId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Job id</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="JR-007B1K9"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>



                                <div className="flex flex-row gap-x-2 justify-between">
                                    <FormField
                                        control={form.control}
                                        name="cgpa"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>CGPA</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder=""
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="yog"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year of Graduation</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder=""
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                </div>
                                <div className="flex flex-row gap-x-2 justify-between">
                                    <FormField
                                        control={form.control}
                                        name="yoe"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Year of Exp</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder=""
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />


                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder=""
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="organization"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Organization</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select organization" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {organizations.map((org) => (
                                                        <SelectItem key={org.id} value={org.name}>
                                                            {org.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    disabled={isPending}
                                                    className="min-h-[100px]"
                                                    placeholder="Assassin's Accolade - Ranked Top 10% in the International Coding Combat; Graduated Summa Cum Laude from the Continental Academy of Excellence"
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
                                Send Details
                            </Button>
                        </form>
                    </Form>

                </CardContent>
            </Card>
        </>
    )
}

export default GetDetailsForm
