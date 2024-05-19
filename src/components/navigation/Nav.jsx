import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import { NavButtons } from "./NavButtons";

const Nav = () => {
    return (
        <Navbar isBordered>
            <NavbarBrand>
                <Link href="/" color="black" className="font-bold text-xl">UPM Market</Link>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavButtons />
            </NavbarContent>
        </Navbar>
    );
}
 
export default Nav;