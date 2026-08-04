import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";

type CartItem = {
    productId: number;
    productTitle: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

function Cart({ isOpen, onClose }: Props) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart when opened
    useEffect(() => {
        if (isOpen) {
            try {
                const items = JSON.parse(localStorage.getItem("cart") || "[]");
                setCartItems(items);
            } catch {
                setCartItems([]);
            }
        }
    }, [isOpen]);

    // Sync helper
    function syncCart(updated: CartItem[]) {
        setCartItems(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
        window.dispatchEvent(new Event("cartUpdated"));
    }

    function increase(id: number) {
        const updated = [...cartItems];
        const index = updated.findIndex(i => i.productId === id);

        if (index !== -1) {
            updated[index].quantity += 1;
            syncCart(updated);
        }
    }

    function decrease(id: number) {
        const updated = [...cartItems];
        const index = updated.findIndex(i => i.productId === id);

        if (index !== -1) {
            updated[index].quantity -= 1;

            if (updated[index].quantity <= 0) {
                updated.splice(index, 1);
            }

            syncCart(updated);
        }
    }

    function removeItem(id: number) {
        const confirmDelete = confirm(
            "Are you sure you want to remove this item?"
        );

        if (!confirmDelete) return;

        const updated = cartItems.filter(i => i.productId !== id);
        syncCart(updated);
    }

    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            position="right"
            className="bg-gray-700 text-white w-96"
        >
            {/* Flowbite's built-in Header with close button */}
            <DrawerHeader
                title="My Cart"
                titleIcon={() => null}
                className="border-b border-gray-600 text-white [&>h5]:text-white [&>button]:text-white"
            />

            {/* Flowbite's built-in Scrollable Area */}
            <DrawerItems className="p-4 space-y-4 overflow-y-auto h-[calc(100vh-80px)]">
                {cartItems.length === 0 ? (
                    <p className="text-gray-300">No products in cart</p>
                ) : (
                    cartItems.map(item => (
                        <div
                            key={item.productId}
                            className="flex gap-3 border border-gray-600 p-2 rounded bg-gray-800"
                        >
                            <img
                                src={item.productImage}
                                className="w-20 h-20 object-cover rounded"
                                alt={item.productTitle}
                            />

                            <div className="flex flex-col flex-1">
                                <h3 className="font-medium text-white">
                                    {item.productTitle}
                                </h3>

                                <p className="text-sm text-gray-300">
                                    {(item.productPrice * item.quantity).toFixed(2)}€
                                </p>

                                {/* Controls */}
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => decrease(item.productId)}
                                        className="px-2 border border-gray-500 rounded hover:bg-gray-600 text-white"
                                    >
                                        -
                                    </button>

                                    <span className="text-white">{item.quantity}</span>

                                    <button
                                        onClick={() => increase(item.productId)}
                                        className="px-2 border border-gray-500 rounded hover:bg-gray-600 text-white"
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.productId)}
                                        className="ml-auto text-red-400 hover:text-red-500"
                                    >
                                        <MdDeleteOutline className="text-2xl" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <a
                    className="block w-full p-2 bg-blue-700  text-center text-white font-medium rounded cursor-pointer mt-4"
                    href="/order-form"
                    style={cartItems.length > 0 ? { visibility: 'visible', backgroundColor: "#AD9471" } : { visibility: 'hidden' }}
                >
                    Buy Products
                </a>
            </DrawerItems>
        </Drawer>
    );
}

export default Cart;