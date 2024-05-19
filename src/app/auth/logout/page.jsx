"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


const Logout = () => {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === "loading") return null

    if (status === "authenticated") {
        signOut()
    } else {
        router.push("/");
        router.refresh();
    }
}

export default Logout;