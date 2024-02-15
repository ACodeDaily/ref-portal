"use client"
import { Card, CardContent } from "@/src/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Status, UserRole } from "@prisma/client";
import { PendingMemberRow } from "./pendingMemberRow";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import { PendingFormRow } from "./pendingFormRow";
import { Button } from "@/src/components/ui/button";

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

interface pendingRequestPageProps {
    pendingForms: form[];
    acceptedForms: form[];
    rejectedForms: form[];
    setPendingForms: any;
    setAcceptedForms: any;
    setRejectedForms: any;
}

const RejectedRequestsPage = ({
    pendingForms,
    acceptedForms,
    rejectedForms,
    setPendingForms,
    setAcceptedForms,
    setRejectedForms
}: pendingRequestPageProps) => {

    const updateFormData = (updatedFormData: form) => {
        let tempPending: Array<form> = pendingForms
        let tempAccepted: Array<form> = acceptedForms;
        let tempRejected: Array<form> = [];

        for (let i = 0; i < rejectedForms.length; i++) {
            if (rejectedForms[i].id === updatedFormData.id) {
                if (updatedFormData.status === Status.PENDING) {
                    tempPending.push(updatedFormData);
                }
                else if (updatedFormData.status === Status.ACCEPTED) {
                    tempAccepted.push(updatedFormData);
                }
                else {
                    tempRejected.push(updatedFormData);
                }
            }
            else {
                tempRejected.push(rejectedForms[i]);
            }
        }
        tempPending = tempPending.sort((a, b) => (b.member.codeForcesRating || 0) - (a.member.codeForcesRating || 0));
        tempAccepted = tempAccepted.sort((a, b) => (b.member.codeForcesRating || 0) - (a.member.codeForcesRating || 0));
        setPendingForms(tempPending);
        setAcceptedForms(tempAccepted);
        setRejectedForms(tempRejected);
    }

    const deleteFormData = (deletedForm: form) => {
        let temp: Array<form> = []
        for (let i = 0; i < pendingForms.length; i++) {
            if (pendingForms[i].id === deletedForm.id) {

            }
            else {
                temp.push(pendingForms[i]);
            }
        }
        setPendingForms(temp);
    };

    return (
        <div className="w-[90%] flex flex-col justify-center">
            {rejectedForms.map((form, i) => {
                const statusColorClass =
                    form.status === Status.ACCEPTED
                        ? 'bg-green-200'
                        : form.status === Status.REJECTED
                            ? 'bg-red-300'
                            : 'bg-gray-100';
                return (
                    <Card key={i} className={`w-[100%] mb-3 flex flex-col justify-center`}>
                        <CardContent className="flex flex-col justify-center">
                            <PendingMemberRow key={form.member.id} memberData={form.member} />
                            <div className="flex flex-col justify-center">
                                <div>
                                    <Table style={{ fontSize: '0.8rem', overflowX: 'visible' }}>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">Organization</TableHead>
                                                <TableHead className="text-center">Job Id</TableHead>
                                                <TableHead className="text-center">Phone Number</TableHead>
                                                <TableHead className="text-center">CGPA</TableHead>
                                                <TableHead className="text-center">{"Exp(year)"}</TableHead>
                                                <TableHead className="text-center">{"Grad. Year"}</TableHead>
                                                <TableHead className="text-center">{"Grad. Status"}</TableHead>
                                                <TableHead className="text-center">Message</TableHead>
                                                <TableHead className="text-center"><Button variant="link">Resume</Button></TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-center">Response</TableHead>
                                                <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                                                    <TableHead className="text-center">Verified By</TableHead>
                                                </RoleGateForComponent>
                                                <TableHead className="text-center">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            <PendingFormRow key={form.id} formData={form} onUpdateFormData={updateFormData} onDeleteFormData={deleteFormData} />
                                        </TableBody >
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default RejectedRequestsPage;