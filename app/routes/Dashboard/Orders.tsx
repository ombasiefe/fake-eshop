import React, { useState } from 'react'
import type { Route } from './+types/Orders'
import { prisma } from "~/db.server"

type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: { product: true }
                }
            }
        })

        if (orders.length == 0) {
            return { orders: [], error: "No orders found !" }
        }

        const ordersWithTotal = orders.map(order => {
            const totalPrice = order.items.reduce((sum, item) => {
                return sum + item.price * item.quantity;
            }, 0)
            return { ...order, totalPrice }
        })

        return { orders: ordersWithTotal, error: null };
    } catch (e) {
        console.error("An error occured:", e)
        return { error: "Error while fetching orders !" }
    }
}

function Orders({ loaderData }: Route.ComponentProps) {
    const orders = loaderData.orders
    return (
        <div className='flex gap-2 flex-wrap'>
            {orders?.length == 0 ? (
                <p>{loaderData.error}</p>
            ) : (
                orders?.map((order) => (
                    <div className='border w-[350px] p-10 rounded-md flex-wrap' key={order.id}>
                        <h2 className='text-xl'>Order {order?.id}</h2>
                        <span>{order?.createdAt.toLocaleDateString()}  {order?.createdAt.toLocaleTimeString()}</span>


                        {order.items.map((order_item) => (
                            <div>
                                <h3>{order_item.product.title}</h3>
                                <img src={order_item.product.image} alt={order_item.product.title} className='h-30' />
                                <div className='flex gap-4 text-lg items-center'>
                                    <span >Qauntity:{order_item.quantity}</span>

                                    <span className='bg-white text-black p-1 rounded-md '>Price:{order_item.price}€</span>
                                </div>
                            </div>
                        ))}
                        <h2 className='text-2xl mx-48'>Total: {order.totalPrice}€</h2><hr />
                        <div>
                            <h2 className='text-xl'>Customer Details</h2>
                            <h3>Full Name: {order.firstName} {order.lastName}</h3>
                            <div className='flex gap-4'>
                                <h3>email:{order.email}</h3>
                                <h3>Tel:{order.tel}</h3>
                            </div>
                            <div className='flex gap-4'>

                                <h3>Address:{order.address}</h3>
                                <h3>PostalCode:{order.postalCode}</h3>
                            </div>
                        </div>

                    </div>
                ))
            )}
        </div>
    )
}

export default Orders