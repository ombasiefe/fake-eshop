import React from 'react'
import { Form } from 'react-router'
import { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import type { Route } from './+types/OrderForm';
import { Resend } from 'resend';
import { getSession } from '~/session.server';
import { redirect } from 'react-router';
import { HiShoppingCart } from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { ManuelOrderStrategy } from '~/services/orders/manual-order';
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
    const address = formData.get("address") as string;
    const postal_code = formData.get("postal_code") as string
    const total_price = formData.get("total_price") as string

    const cart = JSON.parse(formData.get("cart") as string) as CartItem[]
    ////console.log
    (email, first_name, last_name, phone, total_price)
    const resend = new Resend(process.env.RESEND_API_KEY)
    const session = await getSession(request.headers.get('Cookie'));
    const userId = Number(session.get('userId'))
    const service = new ManuelOrderStrategy()
    try {
        const new_order = service.add({
            email: email, tel: phone, userId: userId, address: address, firstName: first_name, lastName: last_name, postalCode: postal_code,
            items: cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.productPrice
            }))
        })

        if (await new_order) {
            //console.log
            ('New order added successfully !')
        }
        const productRows = cart
            .map(
                (item) => `
      <tr>
        <td>${item.productTitle}</td>
        <td style="text-align:center;">${item.quantity}</td>
        <td style="text-align:right;">€${item.productPrice.toFixed(2)}</td>
        <td style="text-align:right;">€${(item.productPrice * item.quantity).toFixed(2)}</td>
      </tr>
    `
            )
            .join("");
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: "efe127652@gmail.com",
            subject: `🛒 New Order from ${first_name} ${last_name}`,
            html: `
<!DOCTYPE html>
<html>
<head>
<style>
body{
    font-family:Arial,sans-serif;
    background:#f4f4f4;
    padding:30px;
}

.container{
    max-width:700px;
    margin:auto;
    background:#fff;
    border-radius:10px;
    padding:30px;
    box-shadow:0 3px 10px rgba(0,0,0,.1);
}

h1{
    color:#2563eb;
    margin-bottom:25px;
}

.section{
    margin-bottom:25px;
}

.info-table{
    width:100%;
    border-collapse:collapse;
}

.info-table td{
    padding:8px;
    border-bottom:1px solid #eee;
}

.products{
    width:100%;
    border-collapse:collapse;
    margin-top:15px;
}

.products th{
    background:#2563eb;
    color:white;
    padding:10px;
}

.products td{
    padding:10px;
    border-bottom:1px solid #ddd;
}

.total{
    margin-top:25px;
    text-align:right;
    font-size:20px;
    font-weight:bold;
}

.footer{
    margin-top:30px;
    color:#777;
    font-size:14px;
}
</style>
</head>

<body>

<div class="container">

<h1>🛒 New Order Received</h1>

<div class="section">

<h2>Customer Details</h2>

<table class="info-table">
<tr>
<td><strong>Name</strong></td>
<td>${first_name} ${last_name}</td>
</tr>

<tr>
<td><strong>Email</strong></td>
<td>${email}</td>
</tr>

<tr>
<td><strong>Phone</strong></td>
<td>${phone}</td>
</tr>

<tr>
<td><strong>Address</strong></td>
<td>${address}</td>
</tr>

<tr>
<td><strong>Postal Code</strong></td>
<td>${postal_code}</td>
</tr>

</table>

</div>

<h2>Ordered Products</h2>

<table class="products">

<thead>
<tr>
<th>Product</th>
<th>Qty</th>
<th>Price</th>
<th>Subtotal</th>
</tr>
</thead>

<tbody>
${productRows}
</tbody>

</table>

<div class="total">
Total: €${Number(total_price).toFixed(2)}
</div>

<div class="footer">
Order generated from your webshop.
</div>

</div>

</body>
</html>
`,
        });

        return redirect("/products?success=true")
    } catch (eror) {

        console.error("Error while sending the email:", eror)
    }
}

function OrderForm({ actionData }: Route.ComponentProps) {
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
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
    );
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
                    {cartItems.length == 0 ? (
                        <div className='flex flex-col justify-center items-center gap-1'>
                            <p className='p-2 bg-white text-black rounded-md '>Cart is empty, there is no item to be ordered !</p>
                            <Button className='w-max' href='/products' style={{ backgroundColor: "#AD9471" }}>
                                <HiShoppingCart className='me-2 h-4 w-4' />
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <Form method='post' className="max-w-md mx-auto">
                            <input type="hidden" name="cart" value={JSON.stringify(cartItems)} />
                            <div>
                                <input type="hidden" name='total_price' value={totalPrice} />
                                <h2>Total: <span className='text-2xl' >{totalPrice.toFixed(2)}€</span> </h2>
                            </div>

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
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="text"
                                        name="address"
                                        id="floating_address"
                                        className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="address"
                                        className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                    >
                                        Adress
                                    </label>
                                </div>
                                <div className="relative z-0 w-full mb-5 group">
                                    <input
                                        type="String"
                                        accept='{0-9}'
                                        name="postal_code"
                                        id="floating_postal_code"
                                        className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
                                        placeholder=" "
                                        required
                                    />
                                    <label
                                        htmlFor="postal_code"
                                        className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                                    >
                                        Postal Code
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="text-white bg-blue-700 box-border border border-transparent text-sm px-4 py-2.5  rounded-md cursor-pointer "
                                style={{ backgroundColor: "#AD9471" }}
                            >
                                Submit
                            </button>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default OrderForm