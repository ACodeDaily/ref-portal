import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: { userId }
        });

        return account;
    } catch {
        return null;
    }
};


export const roleFinder = (key: string) => {

    switch (key) {
        case "ADMIN":
            return UserRole.ADMIN
            break;
        case "USER":
            return UserRole.USER
            break;
        case "MOD":
            return UserRole.MOD
            break;
        case "REFERRER":
            return UserRole.REFERRER
            break;
        case "ADMINREF":
            return UserRole.ADMINREF
            break;
        case "MODREF":
            return UserRole.MODREF
            break;

        default:
            break;
    }
}

export const roleFinderString = (key: UserRole) => {

    switch (key) {
        case UserRole.ADMIN:
            return "ADMIN"
            break;
        case UserRole.USER:
            return "USER"
            break;
        case UserRole.MOD:
            return "MOD"
            break;
        case UserRole.REFERRER:
            return "REFERRER"
            break;
        case UserRole.ADMINREF:
            return "ADMINREF"
            break;
        case UserRole.MODREF:
            return "MODREF"
            break;

        default:
            break;
    }
}