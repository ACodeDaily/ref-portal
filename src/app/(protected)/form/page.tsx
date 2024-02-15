"use client";
import { Status, UserRole } from "@prisma/client";

import { useEffect, useReducer, useState } from "react";

import { RoleGate } from "@/src/components/auth/role-gate";
import PageLoader from "@/src/components/loader";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import { redirect, usePathname } from 'next/navigation'
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import { PendingFormRow } from "../_components/pendingFormRow";
import { PendingMemberRow } from "../_components/pendingMemberRow";
import PendingRequestsPage from "../_components/tabPending";
import RejectedRequestsPage from "../_components/tabRejected";
import AcceptedRequestsPage from "../_components/tabAccepted";

interface form {
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
    member: member
}

interface member {
    id: string;
    name: string;
    email: string;
    codeForces: string;
    leetcode: string;
    linkedIn?: string | null;
    codeForcesRating?: number;
    forms?: form[];
}


const FormPage = () => {
    const [loadingData, setLoadingData] = useState(true);
    const [tabNum, setTabNum] = useState(0);
    const [pendingForms, setPendingForms] = useState<form[]>([]);
    const [acceptedForms, setAcceptedForms] = useState<form[]>([]);
    const [rejectedForms, setRejectedForms] = useState<form[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTabNum(0);
                console.log(loadingData)
                const response = await fetch('/api/form'); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                const pendingData = result.pendingForms || []; // Use an empty array as a default value if result.data is undefined or null
                const acceptedData = result.acceptedForms || [];
                const rejectedData = result.rejectedForms || [];
                const role = result.role;

                // Sort pending forms based on Codeforces rating
                const pendingMembersInfo: form[] = await fetchCodeforcesInfo(pendingData);
                const sortedPendingForms = pendingMembersInfo.sort(
                    (a, b) => (b.member.codeForcesRating || 0) - (a.member.codeForcesRating || 0)
                );
                setPendingForms(sortedPendingForms);

                // Sort accepted forms based on Codeforces rating
                const acceptedMembersInfo: form[] = await fetchCodeforcesInfo(acceptedData);
                const sortedAcceptedForms = acceptedMembersInfo.sort(
                    (a, b) => (b.member.codeForcesRating || 0) - (a.member.codeForcesRating || 0)
                );
                setAcceptedForms(sortedAcceptedForms);

                // Sort rejected forms based on Codeforces rating
                const rejectedMembersInfo: form[] = await fetchCodeforcesInfo(rejectedData);
                const sortedRejectedForms = rejectedMembersInfo.sort(
                    (a, b) => (b.member.codeForcesRating || 0) - (a.member.codeForcesRating || 0)
                );
                setRejectedForms(sortedRejectedForms);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        }

        if (loadingData === true) {
            fetchData();
        }

    }, [loadingData]);

    const fetchCodeforcesInfo = async (pendingData: form[]): Promise<form[]> => {
        const handles = pendingData.map((form) => form.member.codeForces).join(';');
        const apiUrl = `https://codeforces.com/api/user.info?handles=${handles}`;

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();
            if (result.status === 'OK') {
                // Extract Codeforces rating information from the API response
                const codeforcesInfo: form[] = result.result.map((userInfo: any) => {
                    const codeForcesRating = userInfo.rating || 0;

                    // Find the corresponding member in the original data
                    const form = pendingData.find((form) => form.member.codeForces === userInfo.handle);
                    if (form?.member) {
                        form.member['codeForcesRating'] = codeForcesRating;
                    }
                    return form;
                });

                return codeforcesInfo;
            } else {
                console.error('Codeforces API error:', result.comment);
                return pendingData;
            }
        } catch (error) {
            console.error('Error fetching Codeforces data:', error);
            return pendingData;
        }
    };

    return (
        <>
            <PageLoader loading={loadingData} />

            <RoleGate allowedRole={[UserRole.ADMIN, UserRole.MOD, UserRole.REFERRER]}>
                <Card className="w-[90%]">
                    <CardHeader className="bg-secondary rounded-xl">
                        <div className="flex flex-col justify-center items-center ">
                            <div className='flex sm:gap-x-2 max-sm:flex-col max-sm:gap-y-3'>
                                <Button
                                    asChild
                                    className="cursor-pointer"
                                    variant={tabNum === 0 ? "default" : "outline"}
                                    onClick={() => {
                                        if (tabNum !== 0) {
                                            setTabNum(0);
                                        }
                                    }}
                                >
                                    <a>⏳ Pending Requests</a>
                                </Button>
                                <Button
                                    asChild
                                    className="cursor-pointer"
                                    variant={tabNum === 1 ? "default" : "outline"}
                                    onClick={() => {
                                        if (tabNum !== 1) {
                                            setTabNum(1);
                                        }
                                    }}
                                >
                                    <a>✅ Accepted Requests</a>
                                </Button>
                                <Button
                                    asChild
                                    className="cursor-pointer"
                                    variant={tabNum === 2 ? "default" : "outline"}
                                    onClick={() => {
                                        if (tabNum !== 2) {
                                            setTabNum(2);
                                        }
                                    }}
                                >
                                    <a>❌ Rejected Requests</a>
                                </Button>
                            </div>
                            <Button
                                asChild
                                className="cursor-pointer mt-1"
                                variant={"outline"}
                                onClick={() => {
                                    setTabNum(0);
                                    setLoadingData(true);
                                    setLoadingData(true);
                                }}
                            >
                                <Link href='/form'>⟳ Refresh Page</Link>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>
                {
                    tabNum === 0 ?
                        <PendingRequestsPage
                            pendingForms={pendingForms}
                            acceptedForms={acceptedForms}
                            rejectedForms={rejectedForms}
                            setPendingForms={setPendingForms}
                            setAcceptedForms={setAcceptedForms}
                            setRejectedForms={setRejectedForms}
                        /> :
                        tabNum === 1 ?
                            <AcceptedRequestsPage
                                pendingForms={pendingForms}
                                acceptedForms={acceptedForms}
                                rejectedForms={rejectedForms}
                                setPendingForms={setPendingForms}
                                setAcceptedForms={setAcceptedForms}
                                setRejectedForms={setRejectedForms}
                            /> :
                            <RejectedRequestsPage
                                pendingForms={pendingForms}
                                acceptedForms={acceptedForms}
                                rejectedForms={rejectedForms}
                                setPendingForms={setPendingForms}
                                setAcceptedForms={setAcceptedForms}
                                setRejectedForms={setRejectedForms}
                            />
                }
            </RoleGate>
        </>
    )
};

export default FormPage;