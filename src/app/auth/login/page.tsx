"use client";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card, CardBody, Checkbox, Button, Input, Link, Divider, Tooltip } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { Microsoft } from "@/components/icons/Microsoft";
import { useRouter, useParams } from "next/navigation";


const Login = () => {
    const router = useRouter();
    const params = useParams<{ callbackUrl: string }>();

    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState(false);
    const [password, setPassword] = useState("");

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            const response = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: params?.callbackUrl ?? "/",
            });

            if (!response?.error) {
                router.push(response?.url ?? "");
                router.refresh();
            }

            if (!response?.ok) {
                setFormError(true);
            }
        } catch (error) {
            console.error("Registration Failed:", error);
        }

        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center p-4">
            <h1 className="font-medium text-xl">Welcome Back</h1>
            <h2 className="text-center pb-8 text-small">Log in to your account to continue</h2>
            <Card className="max-w-sm w-full">
                <CardBody className="gap-6 px-8 py-6">
                    <form className="flex flex-col items-center gap-y-4">
                        <Input
                            type="email"
                            label="Email Address"
                            variant="bordered"
                            placeholder="Enter your email"
                            className="max-w-xs"
                            onValueChange={setEmail}
                            onChange={() => setFormError(false)}
                            color={formError ? "danger" : "primary"}
                            isInvalid={formError}
                        />
                        <Input
                            label="Password"
                            variant="bordered"
                            placeholder="Enter your password"
                            onValueChange={setPassword}
                            onChange={() => setFormError(false)}
                            isInvalid={formError}
                            errorMessage={formError ? "Invalid email or password" : ""}
                            color={formError ? "danger" : "primary"}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                {isVisible ? (
                                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="max-w-xs"
                        />

                        <div className="flex justify-between items-center w-full max-w-xs">
                            <Checkbox color="primary">
                                <span className="text-sm">Remember me</span>
                            </Checkbox>

                            <Link href="/password-reset" color="primary" className="text-sm">Forgot password?</Link>
                        </div>

                        <Button
                            type="button"
                            onClick={handleSubmit}
                            isLoading={isLoading}
                            className="w-full max-w-xs" color="primary">
                                Log In
                        </Button>
                    </form>

                    <div className="flex items-center gap-4 w-full">
                        <Divider className="shrink" />
                        <span className="text-tiny text-default-500 font-light shrink-0">OR</span>
                        <Divider className="shrink" />
                    </div>

                    <div>
                        <Button
                            type="button"
                            variant="bordered"
                            disabled={true}
                            startContent={<Microsoft />}
                            className="w-full max-w-xs">
                                Coming soon …
                        </Button>
                    </div>

                    <div>
                        <p className="text-small text-center">
                            Need to create an account?
                            <Link href="/auth/register" color="primary" className="ml-1 text-small">Sign up</Link>
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default Login;