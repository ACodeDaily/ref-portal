'use client';

import Image from "next/image";
// import { useRouter } from "next/navigation";

const Logo = () => {
    // const router = useRouter();

    return (
        <Image
            // onClick={() => router.push('/')}
            className="hidden md:block"
            src="/images/logo2.png"
            height="80"
            width="80"
            alt="Logo"
        />
    );
}

export default Logo;