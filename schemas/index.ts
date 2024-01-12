import { UserRole, Status } from "@prisma/client";
import * as z from "zod";

export const RequestSchema = z.object({
    role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.MOD, UserRole.ADMINREF, UserRole.MODREF, UserRole.REFERRER]),
})


// correct


export const formUpdateSchema = z.object({
    referrerResponse: (z.string()),
    status: (z.enum([Status.ACCEPTED, Status.PENDING, Status.REJECTED])),
})


export const ModeratorUpdateSchema = z.object({
    isVerified: (z.boolean()),
    role: (z.enum([UserRole.ADMIN, UserRole.USER, UserRole.MOD, UserRole.ADMINREF, UserRole.MODREF, UserRole.REFERRER])),
})







export const SettingSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER, UserRole.MOD, UserRole.ADMINREF, UserRole.MODREF, UserRole.REFERRER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
})
    .refine((data) => {
        if (data.password && !data.newPassword) {
            return false;
        }

        return true;
    }, {
        message: "New password is required!",
        path: ["newPassword"]
    })
    .refine((data) => {
        if (data.newPassword && !data.password) {
            return false;
        }

        return true;
    }, {
        message: "Password is required!",
        path: ["password"]
    })


export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    }),
    name: z.string().min(1, {
        message: "Name is required"
    }),
    organization: z.string().min(1, {
        message: "Organization is required"
    }),

});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum 6 characters required"
    })
});



export const DetailSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required"
    }),

    email: z.string().email({
        message: "Email is required"
    }),

    codeForces: z.string().min(1, {
        message: "CodeForces username is required"
    }),

    leetcode: z.string().min(1, {
        message: "LeetCode username is required"
    }),

    resume: z.string().url({
        message: "Resume link is required"
    }),

    jobId: z.string().min(1, {
        message: "Job ID is required"
    }),

    message: z.string().min(1, {
        message: "message is required"
    }),

    organization: z.string().min(1, {
        message: "Organization is required"
    }),

    phoneNumber: z.string().length(10, {
        message: "Phone number is required"
    }),

    cgpa: z.string().length(1, {
        message: "CGPA is required"
    }),

    yoe: z.string().length(1, {
        message: "yoe is required"
    }),

});