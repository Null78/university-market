"use client";
import { signIn, signOut, useSession } from "next-auth/react";

const Login = () => {
    const { data: session } = useSession();
    console.log(session?.user);
    return (
        <div>
            <h1>Login</h1>
        </div>
    );
}

export default Login;