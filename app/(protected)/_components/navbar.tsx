"use client"

import { UserButton } from '@/components/ui/user-button'
import { Button } from '@/components/ui/button'
import { useCurrentRole } from '@/hooks/use-currrent-role'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


const Navbar = () => {
    const pathname = usePathname();
    const role = useCurrentRole();
    return (
        <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[90%] shadow-sm'>
            <div className='flex gap-x-2'>
                {(role === UserRole.ADMIN || role === UserRole.MODREF || role === UserRole.ADMINREF || role === UserRole.REFERRER) &&
                    <Button
                        asChild
                        variant={pathname === "/member" ? "default" : "outline"}
                    >
                        <Link href="/member">Members</Link>
                    </Button>

                }

                {(role === UserRole.ADMIN || role === UserRole.ADMINREF || role === UserRole.MOD || role === UserRole.MODREF) &&
                    <Button
                        asChild
                        variant={pathname === "/referrer" ? "default" : "outline"}
                    >
                        <Link href="/referrer">Referrer</Link>
                    </Button>
                }


                {
                    (role === UserRole.ADMIN || role === UserRole.ADMINREF) &&
                    <Button
                        asChild
                        variant={pathname === "/moderator" ? "default" : "outline"}
                    >
                        <Link href="/moderator">Moderator</Link>
                    </Button>
                }


                {
                    (role === UserRole.ADMIN || role === UserRole.ADMINREF || role === UserRole.MOD || role === UserRole.MODREF) &&
                    <Button
                        asChild
                        variant={pathname === "/request" ? "default" : "outline"}
                    >
                        <Link href="/request">Requests</Link>
                    </Button>
                }

                <Button
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                >
                    <Link href="/settings">Settings</Link>
                </Button>
            </div>
            <UserButton />
        </nav>
    )
}

export default Navbar

