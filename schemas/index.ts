import * as z from "zod";

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
        message: "Code Forces username is required"
    }),

    leetcode: z.string().min(1, {
        message: "LeetCode username is required"
    }),

    resume: z.string().email({
        message: "Resume link is required"
    }),

});