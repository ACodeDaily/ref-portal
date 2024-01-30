"use client";

import { RoleGate } from "@/src/components/auth/role-gate";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";


import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, } from "@/src/components/ui/table"

import { ModeratorRow } from "../_components/moderatorRow";
import { RoleGateForComponent } from "@/src/components/auth/role-gate-component";
import PageLoader from "@/src/components/loader";
import { useCurrentRole } from "@/src/hooks/use-currrent-role";

interface user {
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


const ModeratorPage = () => {

    const [users, setUsers] = useState<user[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true)

    const currentROle = useCurrentRole();


    useEffect(() => {
        if (currentROle === UserRole.ADMIN || currentROle === UserRole.MOD) {
            const fetchData = async () => {
                try {
                    const response = await fetch('/api/referrers'); // Adjust the API endpoint based on your actual setup
                    const result = await response.json();
                    setUsers(result.data || []); // Use an empty array as a default value if result.data is undefined or null
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoadingUsers(false);
                }
            };

            fetchData();
        } else {
            setLoadingUsers(false);

        }
    }, []);


    const updateUserData = (updatedUserData: user) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUserData.id ? { ...updatedUserData } : user
            )
        );
    }

    const deleteUserData = (deletedUser: user) => {
        setUsers((prevUsers) => {
            // Filter out the deleted user based on its id
            const updatedUsers = prevUsers.filter((user) => user.id !== deletedUser.id);
            return updatedUsers;
        });
    };


    return (
        <>
            <PageLoader loading={loadingUsers} />

            <RoleGate allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                <Card className="w-[90%]">
                    <CardHeader>
                        <p className="text-2xl font-semibold text-center">
                            🧑🏽‍💻 Referrers
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <Table>
                            <TableCaption>End of list</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">Name</TableHead>
                                    <TableHead className="text-center">Email</TableHead>
                                    <TableHead className="text-center">Organization</TableHead>
                                    <TableHead className="text-center">Verified</TableHead>
                                    <TableHead className="text-center">Role</TableHead>
                                    <RoleGateForComponent allowedRole={[UserRole.ADMIN, UserRole.MOD]}>
                                        <TableHead className="text-center">Verified By</TableHead>
                                    </RoleGateForComponent>
                                    <TableHead className="text-center">Action</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    user.role === UserRole.REFERRER &&
                                    <ModeratorRow key={user.id} userData={user} onUpdateUserData={updateUserData} onDeleteUserData={deleteUserData} />
                                ))}
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card >
            </RoleGate >
        </>

    );
};

export default ModeratorPage;