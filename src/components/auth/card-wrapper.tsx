'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card";
import { Header } from "@/src/components/auth/header";
import { Social } from "@/src/components/auth/social";
import { BackButton } from "@/src/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial
}: CardWrapperProps) => {
    return (
        <Card className="w-[270px] md:w-[400px] mx-auto shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>

            <CardContent>
                {children}
            </CardContent>

            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
    )
}