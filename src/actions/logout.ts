"use server"

import { signOut } from "@/src/auth"

export const logout = async () => {
    // some server stuff
    await signOut()
}