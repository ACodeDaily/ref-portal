
"use client"
import { useState, ChangeEvent } from "react"
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { Status } from "@prisma/client"
import { toast } from "sonner";
import Link from "next/link"
import { DialogDemo } from "@/src/components/dialog-demo";

import {
    Table,
    TableBody,
    TableCaption,
    TableHead,
    TableHeader,
    TableRow, TableCell
} from "@/src/components/ui/table"
import { FaGoogleDrive } from "react-icons/fa";

import PageLoader from "@/src/components/loader";


interface formData {
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

interface member {
    id: string;
    name: string | null;
    email: string | null;
    codeForces: string | null;
    leetcode: string | null;
    forms: formData[]
}



const SearchPageDetail = () => {



    const [cfUsername, setCfUsername] = useState<string | undefined>("")

    const [loadingUsers, setLoadingUsers] = useState(false)


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCfUsername(event.target.value);
    };

    const [details, setDetails] = useState<member>();

    const fetchMemberWithForms = async () => {
        try {
            setLoadingUsers(true)
            const response = await fetch(`/api/forms/?cfUserName=${cfUsername}`);
            const result = await response.json();

            if (result.data !== null) {
                setDetails(result.data);
                toast.success("records found");
            } else {
                toast.error("CodeForces handle not present in records kindly check");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoadingUsers(false);
        }
    };

    return (

        <Card className="w-[90%] shadow-md justify-center items-center my-2">
            <CardContent className="w-full flex flex-col gap-y-8 items-center justify-center">
                <div className="flex w-full max-w-sm item-center space-x-2 mt-5 ml-5">
                    <Input type="text" placeholder="CodeForces Username" value={cfUsername}
                        onChange={handleInputChange} />
                    <Button type="submit" onClick={fetchMemberWithForms}>Get Details</Button>
                </div>
            </CardContent>
            <PageLoader loading={loadingUsers} />
            {details &&
                <>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead className="text-center"><Button variant="link">CodeForces</Button></TableHead>
                                <TableHead className="text-center"><Button variant="link">Leetcode</Button></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium text-center">{details.name}</TableCell>
                                <TableCell className="text-center"><Button variant={"link"}><Link href={`https://codeforces.com/profile/${details.codeForces}`} target="__blank">{details.codeForces}</Link></Button> </TableCell>
                                <TableCell className="text-center"><Button variant={"link"}><Link href={`https://leetcode.com/${details.leetcode}`} target="__blank">{details.leetcode}</Link></Button> </TableCell>
                            </TableRow>
                        </TableBody >
                    </Table>

                    <Table>
                        <TableCaption>End of list</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Organization</TableHead>
                                <TableHead className="text-center">Job Id</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Response</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.forms.map((form) => (
                                <TableRow key={form.id} className={
                                    form.status === Status.ACCEPTED
                                        ? 'bg-green-400'
                                        : form.status === Status.REJECTED
                                            ? 'bg-red-300'
                                            : 'bg-gray-100'
                                }>
                                    <TableCell className="font-medium text-center">{form.organization}</TableCell>
                                    <TableCell className="text-center">{form.jobId}</TableCell>

                                    <TableCell className="text-center">{form.status} </TableCell>
                                    <TableCell className="text-center"><DialogDemo
                                        dialogTrigger="Response"
                                        dialogTitle="Response"
                                        dialogDescription="Key note from referrer side"
                                        ButtonLabel="yes"
                                    >
                                        {form.referrerResponse ? <p>{form.referrerResponse} </p> : <p>No Response</p>}

                                    </DialogDemo> </TableCell>


                                </TableRow >
                            ))}
                        </TableBody >
                    </Table>
                </>
            }

        </Card >
    )
}

export default SearchPageDetail
