'use client';

import {NavbarItem, Link, Button, Skeleton} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import {Avatar} from "@nextui-org/avatar";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
  } from "@nextui-org/dropdown";
import { LogoutIcon } from "@/components/icons/LogoutIcon"
import { ListingIcon } from "@/components/icons/ListingIcon"

export const NavButtons = () => {
    const { data: session, status } = useSession()
    
    return (
        <>
        {status === "loading" && (
            <>
            <Skeleton isLoaded={status !== "loading"} className="rounded-lg" >
                <div className="h-10 w-20 rounded-lg bg-transparent">
                </div>
            </Skeleton>
            <Skeleton isLoaded={status !== "loading"} className="rounded-lg" >
                <div className="h-10 w-20 rounded-lg bg-transparent">
                </div>
            </Skeleton>
            </>
        )}
        {status === "unauthenticated" && (
            <>
                <Skeleton isLoaded={status !== "loading"} className="rounded-lg" >
                    <NavbarItem className="hidden lg:flex">
                        <Link href="/auth/login" className="text-sm">Login</Link>
                    </NavbarItem>
                </Skeleton>
                <Skeleton isLoaded={status !== "loading"} className="rounded-lg" >
                    <NavbarItem>
                        <Button as={Link} color="primary" href="/auth/register" variant="flat" className="text-sm">
                            Register
                        </Button>
                    </NavbarItem>
                </Skeleton>
            </>
        )}
        {status === "authenticated" && (
            <>
                <Skeleton isLoaded={status !== "loading"} className="rounded-lg" >
                    <Button as={Link} color="primary" href="/posts/create" className="text-sm">
                        Create Post
                    </Button>
                </Skeleton>
                <Dropdown>
                    <DropdownTrigger>
                        <Button color="default" variant="light" className="px-1">
                            <Avatar name={session.user.firstName} size="sm" />
                            { session.user.firstName } { session.user.lastName }
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="new" href="/posts">
                            <div className="flex gap-1">
                                <ListingIcon className="h-5" />
                                My Posts
                            </div>
                        </DropdownItem>
                        <DropdownItem key="delete" href="/auth/logout" className="text-danger" color="danger">
                            <div className="flex gap-1">
                                <LogoutIcon className="h-5" />
                                Logout
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                    </Dropdown>
                </>
            )}
        </>
    );
}