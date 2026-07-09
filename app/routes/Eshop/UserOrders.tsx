import React, { useEffect, useState } from 'react'
import { getUserId } from '~/session.server'
import type { Route } from './+types/UserOrders'
import { getUserOrders, prisma } from '~/db.server';
import { Button } from 'flowbite-react';
import { Form } from 'react-router';
import { MdCancel } from 'react-icons/md';
type Props = {}
export async function loader({ request }: Route.LoaderArgs) {
    const user_id = await getUserId(request);
    const userId = Number(user_id)
    const Orders = await getUserOrders({ user_id: userId });
    return { orders: Orders }
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get("action");
    const order_id = Number(formData.get("orderId"));
    switch (actionType) {
        case "cancel_order":
            const currentStatus = await prisma.orders.findUnique({
                where: { id: order_id },
            })
            if (currentStatus?.Status == "pending") {
                try {
                    const updated_user = await prisma.orders.update({
                        where: {
                            id: order_id
                        },
                        data: {
                            Status: "canceled"
                        }
                    })
                    if (updated_user.Status === "canceled") {
                        console.log("order cancelled successfully !")
                        return { success: true }
                    }
                } catch (e) {
                    console.error("Error while cancelling an order occured", e)
                    return { error: "Order Could not be canceled", }
                }
            }
            return { success: false }


    }
}
function UserOrders({ loaderData, actionData }: Route.ComponentProps) {
    const { orders } = loaderData.orders
    const success = actionData?.success


    return (
        <div className='flex flex-col gap-1 flex-wrap '>
            {orders?.length === 0 ? (
                <p>No Order found !</p>
            ) : (
                orders?.map((order) => (
                    <div key={order?.id} className='flex flex-wrap border items-center rounded-md p-1 gap-1'  >
                        <h2>{order.createdAt.toLocaleDateString("en-GB")} {order.createdAt.toLocaleTimeString("en-GB")}</h2>
                        <div>
                            {order?.items?.map((orderItem) => (
                                <div className='flex items-center p-1' key={orderItem.id}>
                                    <img src={orderItem.product.image} alt={orderItem.product.title} className='h-20' />
                                    <h3>{orderItem.product?.title}</h3>

                                    <div className='flex gap-1 bg-white text-black p-1 rounded-md mx-1'>
                                        <span>Quantity: {orderItem.quantity} </span>
                                        <span>Product Price: {orderItem.price}€</span>
                                        <span>Total Price: {orderItem.quantity * orderItem.price}€</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h2>Communication Details</h2>
                            <div>
                                <span>email{order.email}</span>
                                <span>tel:{order.tel}</span>
                                <span>Adress: {order.address}</span>
                                <span>postalCode:{order.postalCode}</span>
                            </div>
                            <h3 className='text-2xl'>Total Price: {order.totalPrice}€</h3>
                            <span className='bg-white text-black p-0.5 rounded-md'>Status: {order.Status}</span>
                            {order.Status !== "pending" ? (
                                <p>The order status can not be changed !</p>
                            ) : (
                                <Form method='post'>
                                    <input type="hidden" name='action' value="cancel_order" />
                                    <Button type='submit' color="red" className='mt-2'
                                        name='orderId' value={order.id}>
                                        <MdCancel className='text-2xl mr-1' />
                                        Cancel Order
                                    </Button>
                                </Form>
                            )}

                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default UserOrders