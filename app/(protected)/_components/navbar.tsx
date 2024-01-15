"use client"

import { UserButton } from '@/components/ui/user-button'
import { Button } from '@/components/ui/button'
import { useCurrentRole } from '@/hooks/use-currrent-role'
import { UserRole } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Logo from '@/components/logo'
import Image from "next/image";


const Navbar = () => {
    const pathname = usePathname();
    const role = useCurrentRole();
    return (
        <nav className='bg-secondary flex justify-between items-center p-4 rounded-xl w-[90%] shadow-sm'>
            <div className='flex gap-x-2'>

                <div className='mt-[-1px]'>
                    <Image
                        // onClick={() => router.push('/')}
                        src="/images/TextLogo.png"
                        height="80"
                        width="80"
                        alt="Logo"
                    />
                </div>

                {(role === UserRole.ADMIN || role === UserRole.REFERRER) &&
                    <Button
                        asChild
                        variant={pathname === "/member" ? "default" : "outline"}
                    >
                        <Link href="/member">Members</Link>
                    </Button>

                }

                {(role === UserRole.ADMIN || role === UserRole.MOD) &&
                    <Button
                        asChild
                        variant={pathname === "/referrer" ? "default" : "outline"}
                    >
                        <Link href="/referrer">Referrer</Link>
                    </Button>
                }


                {
                    (role === UserRole.ADMIN) &&
                    <Button
                        asChild
                        variant={pathname === "/moderator" ? "default" : "outline"}
                    >
                        <Link href="/moderator">Moderator</Link>
                    </Button>
                }


                {
                    (role === UserRole.ADMIN || role === UserRole.MOD) &&
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

