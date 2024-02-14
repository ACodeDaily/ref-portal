"use client"

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const FormNavbar = () => {
    const pathname = usePathname();
    const [navbar, setNavbar] = useState(false);
    
    return (
        <div className="flex justify-center items-center ">
            <div className='flex md:gap-x-2 max-md:flex-col max-md:gap-y-3'>
                <Button
                    asChild
                    variant={pathname === "/form/pending" ? "default" : "outline"}
                >
                    <Link href="/form/pending">⏳ Pending Requests</Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === "/form/accepted" ? "default" : "outline"}
                >
                    <Link href="/form/accepted">✅ Accepted Requests</Link>
                </Button>
                <Button
                    asChild
                    variant={pathname === "/form/rejected" ? "default" : "outline"}
                >
                    <Link href="/form/rejected">❌ Rejected Requests</Link>
                </Button>
            </div>
        </div>
    )
}

export default FormNavbar;