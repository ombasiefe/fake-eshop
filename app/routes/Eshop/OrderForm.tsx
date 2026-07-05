import React from 'react'
import { Form } from 'react-router'
import { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import type { Route } from './+types/OrderForm';
import { Resend } from 'resend';
import { getSession } from '~/session.server';
import { redirect } from 'react-router';
export
    type Props = {}
type CartItem = {
    productId: number;
    productTitle: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};
export async function loader({ request }: Route.LoaderArgs) {
    const sesion = await getSession(request.headers.get("Cookie"))
    const userId = sesion.get("userId")
    if (!userId) {
        return redirect('/login');
    }

}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const phone = String(formData.get('phone'));
    console.log(email, first_name, last_name, phone)
    const resend = new Resend(process.env.RESEND_API_KEY)
    try {
        const result = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "efe127652@gmail.com",
            subject: 'Your New Order',
            text: `
            New order received!

            Customer Details:
            Name: ${first_name}
            Email: ${email}
            Phone: ${phone}`
        })
    } catch (eror) {

        console.error("Error while sending the email:", eror)
    }
}

function OrderForm({ }: Props) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Load cart when opened
    useEffect(() => {
        try {
            const items = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartItems(items);
        } catch {
            setCartItems([]);
        }
    }, []);

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
        <div>
            <h1>Order Form</h1>
            <div>
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

                    <Form method='post' className="max-w-md mx-auto">
                        <div className="relative z-0 w-full mb-5 group">
                            <input
                                type="email"
                                name="email"
                                id="floating_email"
                                className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                            >
                                Email address
                            </label>
                        </div>

                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="first_name"
                                    id="floating_first_name"
                                    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="first_name"
                                    className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                >
                                    First name
                                </label>
                            </div>
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="text"
                                    name="last_name"
                                    id="floating_last_name"
                                    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="last_name"
                                    className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                >
                                    Last name
                                </label>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 md:gap-6">
                            <div className="relative z-0 w-full mb-5 group">
                                <input
                                    type="tel"
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    name="phone"
                                    id="floating_phone"
                                    className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="phone"
                                    className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                >
                                    Phone number
                                </label>
                            </div>

                        </div>
                        <button
                            type="submit"
                            className="text-white bg-blue-700 box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md
                             text-sm px-4 py-2.5 focus:outline-none cursor-pointero "
                        >
                            Submit
                        </button>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default OrderForm