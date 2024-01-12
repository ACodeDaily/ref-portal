import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: { email }
        })

        return user;
    } catch {
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: { id }
        })

        return user;
    } catch {
        return null;
    }
}


export interface UserQuery {
    role?: UserRole[];
}

export const getAllUsersWithRole = async (query?: UserQuery) => {
    try {
        const users = await db.user.findMany({
            where: {
                role: query?.role ? { in: query.role } : undefined,
            },
        });
        return users;
    } catch (error) {
        console.error('Error fetching users with role:', error);
        return null;
    }
};