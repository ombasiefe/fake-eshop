import React, { useEffect, useState } from "react";
import { Avatar, Button, Navbar as FlowbiteNavbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link, useRouteLoaderData } from "react-router";
import { AiOutlineShopping } from "react-icons/ai";
import Cart from "./Cart";
import UserProfileDrawer from "./UserProfileDrawer";
import { type loader } from "./EshopMain"


type Props = {};

// Define a type for your root loader data so TypeScript knows what 'user' is.
type RootLoaderData = {
    user?: {
        name: string;
        email: string;
    } | null;
};

function Navbar({ }: Props) {


    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isProfileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItemCount(cart.length);
        };

        updateCount();
        window.addEventListener("cartUpdated", updateCount);

        return () => {
            window.removeEventListener("cartUpdated", updateCount);
        };
    }, []); // ✅ Fix: Added empty dependency array so this runs only once on mount

    const data = useRouteLoaderData<typeof loader>("routes/Eshop/EshopMain")
    const user = data?.user


    return (
        <>
            <FlowbiteNavbar fluid rounded className="border-b shadow-sm z-50">
                <NavbarBrand as={Link} href="/">
                    <img
                        src="/carousel_images/Oura_Navbar_Logo_2.png"
                        className="mr-3 h-6 sm:h-9 "
                        alt="Logo"
                    />
                    <span className="self-center whitespace-nowrap text-xl font-sans ">
                        Oura-Shop
                    </span>
                </NavbarBrand>

                <div className="flex md:order-2 items-center gap-2" >
                    <Button
                        color="light"
                        onClick={() => setIsCartOpen(true)}
                        className="relative"
                    >
                        <AiOutlineShopping className="text-2xl" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 rounded-full bg-blue-600 text-white text-xs px-2 py-0.5">
                                {cartItemCount}
                            </span>
                        )}
                    </Button>

                    {/* Only show the profile button if a user is logged in */}
                    {user ? (
                        <Avatar onClick={() => setProfileOpen(true)} rounded
                        >
                        </Avatar>

                    ) : (
                        <Button as={Link} to="/login"
                            style={{ backgroundColor: "#AD9471" }}>
                            Login
                        </Button>
                    )}
                    <NavbarToggle />
                </div>

                <NavbarCollapse>
                    <NavbarLink as={Link} href="/">
                        Home
                    </NavbarLink>
                    <NavbarLink href="/products">
                        Products
                    </NavbarLink>
                    <NavbarLink href="/about" >
                        About
                    </NavbarLink>
                    <NavbarLink href="/contact" >
                        Contact
                    </NavbarLink>
                </NavbarCollapse>
            </FlowbiteNavbar>

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            {/* ✅ Render the drawer only if user is present to avoid type crashes */}
            {user && (
                <UserProfileDrawer
                    isOpen={isProfileOpen}
                    handleClose={() => setProfileOpen(false)}
                    user={user}
                />
            )}
        </>
    );
}

export default Navbar;