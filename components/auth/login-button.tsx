"use client";

import { useRouter } from "next/navigation";


interface LoginButtonPops {
    children: React.ReactNode;
    mode?: "modal" | "redirect",
    asChild?: boolean;
};

export const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}: LoginButtonPops) => {

    const router = useRouter()

    const onClick = () => {
        router.push("/auth/login")
    }

    if (mode === "modal") {
        return (
            <span>
                TODO: Implement Modal
            </span>
        )
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )

}