"use client";

import { RoleGate } from "@/components/auth/role-gate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { useEffect, useState } from "react";


import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

import { ModeratorRow } from "../_components/moderatorRow";

interface user {
    id: string;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    organization: string | null;
    isVerified: boolean;
    role: UserRole;
    isTwoFactorEnabled: boolean;
}


const ModeratorPage = () => {

    const [users, setUsers] = useState<user[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/referrers'); // Adjust the API endpoint based on your actual setup
                const result = await response.json();
                setUsers(result.data || []); // Use an empty array as a default value if result.data is undefined or null
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    const updateUserData = (updatedUserData: user) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === updatedUserData.id ? { ...updatedUserData } : user
            )
        );
    }


    return (
        <Card className="w-[90%]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🔑 Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <Table>
                        <TableCaption>End of list</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Organization</TableHead>
                                <TableHead>Verified</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                user.role === UserRole.REFERRER &&
                                <ModeratorRow userData={user} onUpdateUserData={updateUserData} />
                            ))}
                        </TableBody>

                    </Table>
                </RoleGate>
            </CardContent>
        </Card>
    );
};

export default ModeratorPage;