
"use client";

import {
    Button,
    Drawer,
    DrawerHeader,
    DrawerItems,
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
    TextInput,
} from "flowbite-react";
import { useState } from "react";
import {
    HiChartPie,
    HiClipboard,
    HiCollection,
    HiInformationCircle,
    HiLogin,
    HiPencil,
    HiSearch,
    HiShoppingBag,
    HiUsers,
} from "react-icons/hi";
import { IoMenu } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineCategory } from "react-icons/md";
import { RiFunctionAddLine } from "react-icons/ri"
import { IoNotifications } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi"
export function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => setIsOpen(false);

    return (
        <>
            <div className="flex mt-4 items-center justify-center  mx-1">
                <Button onClick={() => setIsOpen(true)}><IoMenu className="text-xl" />
                </Button>
            </div>
            <Drawer open={isOpen} onClose={handleClose}>
                <DrawerHeader title="MENU" titleIcon={() => <></>} />
                <DrawerItems>
                    <Sidebar
                        aria-label="Sidebar with multi-level dropdown example"
                        className="[&>div]:bg-transparent [&>div]:p-0"
                    >
                        <div className="flex h-full flex-col justify-between py-2">
                            <div>
                                <form className="pb-3 md:hidden">
                                    <TextInput icon={HiSearch} type="search" placeholder="Search" required size={32} />
                                </form>
                                <SidebarItems>
                                    <SidebarItemGroup>
                                        <SidebarItem href="/admin" icon={HiChartPie}>
                                            Dashboard
                                        </SidebarItem>
                                        <SidebarItem href="/admin/products" icon={AiOutlineProduct}>
                                            Products
                                        </SidebarItem>
                                        <SidebarItem href="#" icon={HiUsers}>
                                            My customers
                                        </SidebarItem>
                                        <SidebarItem href="/admin/products/categories" icon={MdOutlineCategory}>
                                            Categories
                                        </SidebarItem>
                                        <SidebarItem href="/admin/products/add_product" icon={RiFunctionAddLine}>
                                            Add Product
                                        </SidebarItem>
                                    </SidebarItemGroup>
                                    <SidebarItemGroup>

                                        <SidebarItem href="/admin/orders" icon={HiShoppingBag}>
                                            Orders
                                        </SidebarItem>
                                        <SidebarItem href="/admin/notifications" icon={IoNotifications}>
                                            Notifications
                                        </SidebarItem>
                                        <SidebarItem href="/admin/logout" icon={BiLogOut}>
                                            Log-Out
                                        </SidebarItem>
                                    </SidebarItemGroup>
                                </SidebarItems>
                            </div>
                        </div>
                    </Sidebar>
                </DrawerItems>
            </Drawer>
        </>
    );
}
