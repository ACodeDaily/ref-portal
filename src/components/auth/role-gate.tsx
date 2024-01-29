"use client";

import { UserRole } from "@prisma/client";


import { FormError } from "@/src/components/form-error";
import { useCurrentRole } from "@/src/hooks/use-currrent-role";



interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole[];
};

export const RoleGate = ({
    children,
    allowedRole,
}: RoleGateProps) => {
    const role = useCurrentRole();

    if (!role) {
        return (<></>)
    }

    if (!allowedRole.includes(role)) {
        return (
            <FormError message="You do not have permission to view this content!" />
        )
    }

    return (
        <>
            {children}
        </>
    );
};