"use client"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/src/components/ui/dropdown-menu"

import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/src/components/ui/avatar"
import { FaUser } from "react-icons/fa"
import { ExitIcon } from "@radix-ui/react-icons"

import { useCurrentUser } from "@/src/hooks/use-current-user"
import { LogoutButton } from "@/src/components/auth/logout-button"

export const UserButton = () => {

    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} />
                    <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
                        <FaUser className="text-white" />

                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="h-4 w-4 mr-2" />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}