"use client";

import { UserRole } from "@prisma/client";


import { FormError } from "@/components/form-error";
import { useCurrentRole } from "@/hooks/use-currrent-role";



interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole[];
};

export const RoleGateForComponent = ({
    children,
    allowedRole,
}: RoleGateProps) => {
    const role = useCurrentRole();

    if (!role) {
        return (<></>)
    }

    if (!allowedRole.includes(role)) {
        return (
            <></>
        )
    }

    return (
        <>
            {children}
        </>
    );
};