import { Button, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { Form, useSubmit } from "react-router";
type Props = {
    isOpen: boolean;
    handleClose: () => void;
    user: {
        id: number;
        email: string;
        password: string;
        isAdmin: boolean;
    };
};

export default function UserProfileDrawer({ isOpen, handleClose, user }: Props) {

    return (
        <Drawer open={isOpen} onClose={handleClose} position="right" className="h-50 rounded-md" >
            <DrawerHeader title="Profile" />
            <DrawerItems>
                <div className="space-y-3">
                    <h2>
                        {user?.email || "No email available"}
                    </h2>
                </div>
                <div className="flex gap-4 mt-2">
                    <Button href="/user/orders " style={{ backgroundColor: "#AD9471" }}>
                        My Orders
                    </Button>
                    <Button href="/user/logout" style={{ backgroundColor: "#AD9471" }}>
                        Logout
                    </Button>


                </div>
            </DrawerItems>
        </Drawer>
    );
}