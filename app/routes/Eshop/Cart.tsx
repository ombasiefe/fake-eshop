import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import type { LoaderFunctionArgs } from "react-router";

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

function Cart({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-96 bg-gray-700 shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">My Cart</h2>
                    <button onClick={onClose}>✕</button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 overflow-y-auto h-full">
                    {cartItems.length === 0 ? (
                        <p>No products in cart</p>
                    ) : (
                        cartItems.map(item => (
                            <div
                                key={item.productId}
                                className="flex gap-3 border p-2 rounded"
                            >
                                <img
                                    src={item.productImage}
                                    className="w-20 h-20 object-cover"
                                />

                                <div className="flex flex-col flex-1">
                                    <h3 className="font-medium">
                                        {item.productTitle}
                                    </h3>

                                    <p className="text-sm">
                                        {(item.productPrice * item.quantity).toFixed(2)}€
                                    </p>

                                    {/* Controls */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() =>
                                                decrease(item.productId)
                                            }
                                            className="px-2 border"
                                        >
                                            -
                                        </button>

                                        <span>{item.quantity}</span>

                                        <button
                                            onClick={() =>
                                                increase(item.productId)
                                            }
                                            className="px-2 border"
                                        >
                                            +
                                        </button>

                                        <button
                                            onClick={() =>
                                                removeItem(item.productId)
                                            }
                                            className="ml-auto text-red-600"
                                        >
                                            <MdDeleteOutline size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <a className="p-2 bg-blue-700 text-center cursor-pointer"
                        href="/order-form">
                        Buy Products</a>
                </div>
            </div>
        </>
    );
}

export default Cart;