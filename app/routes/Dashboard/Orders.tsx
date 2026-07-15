import React, { useState } from 'react'
import type { Route } from './+types/Orders'
import { prisma } from "~/db.server"
import prismaClientPkg from "@prisma/client"

import { Form, useSubmit } from 'react-router'
import { Card, Select } from 'flowbite-react'
import { MdCancel } from 'react-icons/md'

const { orders_Status } = prismaClientPkg
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                items: {
                    include: { products: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
        const statusOptions = Object.values(orders_Status);
        if (orders.length == 0) {
            return { orders: [], error: "No orders found !" }
        }

        const ordersWithTotal = orders.map(order => {
            const totalPrice = order.items.reduce((sum, item) => {
                return sum + item.price * item.quantity;
            }, 0)
            return { ...order, totalPrice }
        })

        return { orders: ordersWithTotal, statusOptions, error: null };
    } catch (e) {
        console.error("An error occured:", e)
        return { error: "Error while fetching orders !" }
    }
}
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const actionType = formData.get("action") as string;
    const orderId = Number(formData.get("orderId"))
    const new_status = formData.get("status") as any;

    switch (actionType) {
        case "update_state":
            try {
                const updated_state = await prisma.orders.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        Status: new_status
                    }
                })
                if (updated_state.Status === new_status) {
                    console.log("Status updated successfully !")
                    return { success: true }
                }
            } catch (e) {
                console.error("Error while updadeing order Status", e)
                return { error: "Status Could not be changed", }
            }
    }
}
function Orders({ loaderData }: Route.ComponentProps) {
    const orders = loaderData.orders
    const statusOptions = loaderData.statusOptions
    const submit = useSubmit();


    return (
        <div className='flex gap-2 flex-wrap w-fit'>
            {orders?.length == 0 ? (
                <p>{loaderData.error}</p>
            ) : (
                orders?.map((order) => (
                    <div className='border w-[450px] p-10 flex rounded-md flex-wrap ' key={order.id}>
                        <h2 className='text-xl'>Order <span className='bg-blue-700 p-2 rounded-xl'> {order?.id}</span></h2>
                        <span>{order?.createdAt.toLocaleDateString("en-GB")}  {order?.createdAt.toLocaleTimeString("en-GB")}</span>


                        {order.items.map((order_item) => (
                            <div key={order_item.id}>
                                <div >
                                    <h3>{order_item.products.title}</h3>
                                    <img src={order_item.products.image} alt={order_item.products.title} className='h-30' />
                                </div>
                                <div className='flex gap-4 text-lg items-center'>
                                    <span >Qauntity:{order_item.quantity}</span>

                                    <span className='bg-white text-black p-1 rounded-md '>Price:{order_item.price}€</span>
                                </div>
                            </div>
                        ))}
                        <h2 className='text-2xl mx-48'>Total: {order.totalPrice}€</h2>
                        <div>
                            <h2 className='text-xl'>Customer Details</h2>
                            <h3>Full Name: {order.firstName} {order.lastName}</h3>
                            <div className='flex flex-col gap-4'>
                                <h3>email:{order.email}</h3>
                                <h3>Tel:{order.tel}</h3>
                            </div>
                            <div className='flex gap-4'>

                                <h3>Address:{order.address}</h3>
                                <h3>PostalCode:{order.postalCode}</h3>
                            </div>
                        </div>
                        {order.Status === "canceled" ? (
                            <div className='flex items-center justify-center gap-0.5 mt-3 '>
                                <MdCancel className='text-2xl text-red-600' />
                                <h3 className='text-red-700   rounded-md bg-white'>The Order has been cancelled !</h3>
                            </div>

                        ) : (
                            <Form method='post' onChange={(event) => {
                                let answer = confirm("Are you sure to update the Order Status")
                                if (answer) {
                                    submit(event.currentTarget)
                                }
                            }}>
                                <input type="hidden" name="action" value="update_state" />
                                <input type="hidden" name='orderId' value={order.id} />
                                <Select name="status" className='w-fit'
                                    defaultValue={order.Status}>
                                    {statusOptions?.map((stat_opt) => (
                                        <option
                                            key={stat_opt}
                                            value={stat_opt}
                                            className='white'
                                        >{stat_opt}</option>
                                    ))}
                                </Select>
                            </Form>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}

export default Orders