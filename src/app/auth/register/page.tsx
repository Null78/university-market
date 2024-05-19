"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardBody, Checkbox, Button, Input, Link, Divider, Select, SelectItem, Selection } from "@nextui-org/react";
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { Microsoft } from "@/components/icons/Microsoft";
import { useRouter, useParams } from "next/navigation";


const Register = () => {
    const router = useRouter();
    const params = useParams<{ callbackUrl: string }>();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<Selection>(new Set([]));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [formError, setFormError] = useState(false);
    const [errors, setErrors] = useState<{
        first_name?: string;
        last_name?: string;
        gender?: boolean;
        email?: string;
        phone?: string;
        password?: string;
        confirm_password?: string;
    }>({});

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (password !== confirmPassword) {
            setErrors({
                ...errors,
                confirm_password: "Passwords do not match",
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    phone,
                    gender: (gender as Set<string>).has('male'),
                    password,
                    confirm_password: confirmPassword,
                }),
            }).then((res) => res.json());

            if (!response?.success) {
                setFormError(true);
                setErrors(response.errors);
            }

            if (response?.success) {
                const response = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                    callbackUrl: params?.callbackUrl ?? "/",
                });

                if (!response?.error) {
                    router.push(response?.url ?? "/");
                    router.refresh();
                }
            }
        } catch (error) {
            console.error("Registration Failed:", error);
        }

        setIsLoading(false);
    }

    return (
        <div className="flex flex-col items-center h-screen justify-center p-4">
            <h1 className="font-medium text-xl">Welcome</h1>
            <h2 className="text-center pb-8 text-small">Create your account to get started</h2>
            <Card className="max-w-sm w-full">
                <CardBody className="gap-6 px-8 py-6">
                    <form className="flex flex-col items-center gap-y-4" onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            label="First Name"
                            variant="bordered"
                            placeholder="Enter your first name"
                            className="max-w-xs"
                            onValueChange={setFirstName}
                            onChange={() => setFormError(false)}
                            isRequired
                        />
                        <Input
                            type="text"
                            label="Last Name"
                            variant="bordered"
                            placeholder="Enter your last name"
                            className="max-w-xs"
                            onValueChange={setLastName}
                            onChange={() => setFormError(false)}
                            isRequired
                        />
                        <Input
                            type="email"
                            label="Email Address"
                            variant="bordered"
                            placeholder="Enter your email"
                            className="max-w-xs"
                            onValueChange={setEmail}
                            onChange={() => setFormError(false)}
                            color={((errors?.email ?? null) !== null) ? "danger" : "primary"}
                            isInvalid={formError || (errors?.email ?? null) !== null}
                            errorMessage={errors?.email ?? ""}
                            isRequired
                        />
                        <Input
                            type="tel"
                            label="Phone Number"
                            variant="bordered"
                            placeholder="0500000000"
                            className="max-w-xs"
                            onValueChange={setPhone}
                            onChange={() => setFormError(false)}
                            isRequired
                        />
                        <Input
                            label="Password"
                            variant="bordered"
                            placeholder="Enter your password"
                            onValueChange={setPassword}
                            onChange={() => setFormError(false)}
                            isRequired
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
                        <Input
                            label="Confirm Password"
                            variant="bordered"
                            placeholder="Confirm your password"
                            onValueChange={setConfirmPassword}
                            onChange={() => setFormError(false)}
                            isInvalid={(errors?.confirm_password ?? null) !== null}
                            errorMessage={errors?.confirm_password ?? ""}
                            color={((errors?.confirm_password ?? null) !== null) ? "danger" : "primary"}
                            isRequired
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

                        <Select
                            isRequired
                            variant="bordered"
                            label="Gender"
                            placeholder="Select your gender"
                            className="max-w-xs"
                            
                            selectedKeys={gender}
                            onChange={() => setFormError(false)}
                            onSelectionChange={setGender}
                            >
                                <SelectItem key="male" value="male">
                                    Male
                                </SelectItem>
                                <SelectItem key="female" value="female">
                                    Female
                                </SelectItem>
                        </Select>

                        <div className="flex justify-between items-center w-full max-w-xs">
                            <Checkbox color="primary" isRequired>
                                <span className="text-sm">I agree with the 
                                    <Link href="/terms-and-conditions" color="primary" className="text-sm mx-1">Terms</Link>
                                    and 
                                    <Link href="/privacy-policy" color="primary" className="text-sm mx-1">Privacy Policy</Link>
                                </span>
                            </Checkbox>
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full max-w-xs" color="primary">
                                Sign Up
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
                            Already have an account?
                            <Link href="/auth/login" color="primary" className="ml-1 text-small">Log In</Link>
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default Register;