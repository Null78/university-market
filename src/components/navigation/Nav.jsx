import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";

const Nav = () => {
    return (
        <Navbar>
            <NavbarBrand>
                <p className="font-bold text-xl">UPM Market</p>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                <Link href="/auth/login" className="text-sm">Login</Link>
                </NavbarItem>
                <NavbarItem>
                <Button as={Link} color="primary" href="/auth/register" variant="flat" className="text-sm">
                    Register
                </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
 
export default Nav;