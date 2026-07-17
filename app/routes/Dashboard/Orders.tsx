import React, { useState } from 'react'
import type { Route } from './+types/Orders'
import { prisma } from "~/db.server"
import prismaClientPkg from "@prisma/client"

import { Form, useSubmit } from 'react-router'
import { Button, Card, Select } from 'flowbite-react'
import { MdCancel, MdDelete } from 'react-icons/md'

import { ManuelOrderStrategy } from '~/services/orders/manual-order'

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
    const orderId = Number(formData.get("order_id"))
    const new_status = formData.get("status") as string;
    const service = new ManuelOrderStrategy()
    const statusMap: Record<string, typeof orders_Status[keyof typeof orders_Status]> = {
        pending: orders_Status.pending,
        working_on_it: orders_Status.working_on_it,
        on_the_way: orders_Status.on_the_way,
        delivered: orders_Status.delivered,
        canceled: orders_Status.canceled,
    }
    const selected_Status = statusMap[new_status]
    switch (actionType) {
        case "update_state":
            try {
                if (!selected_Status) {
                    return { error: "Invalid status selected." }
                }
                console.log("orderId", orderId)
                await service.edit(orderId, { status: selected_Status })
            } catch (e) {
                console.error("Error while updadeing order Status", e)
                return { error: "Status Could not be changed", }
            }
            break;
        case "delete_this_order":
            try {

                await service.delete(orderId)
            } catch (e) {
                console.error("Error while deleting the order", e)
                return { error: "Order Could not be deleted", }
            }
            break;
    }
}
function Orders({ loaderData }: Route.ComponentProps) {
    const orders = loaderData.orders
    const statusOptions = loaderData.statusOptions
    const submit = useSubmit();


    return (
        <div className="w-full px-4 py-6">
            {orders?.length === 0 ? (
                <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-lg font-medium">{loaderData?.error || "No orders found."}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {orders?.map((order) => (
                        <div
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between"
                            key={order.id}
                        >
                            {/* Card Header */}
                            <div>
                                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        Order
                                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                                            #{order?.id}
                                        </span>
                                    </h2>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB") : ""} - {order?.createdAt ? new Date(order.createdAt).toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' }) : ""}
                                    </span>
                                </div>

                                {/* Order Items List */}
                                <div className="space-y-4 mb-6 max-h-[220px] overflow-y-auto pr-1">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Items Summary</h3>
                                    {order.items.map((order_item) => (
                                        <div key={order_item.id} className="flex gap-4 items-center bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <img
                                                src={order_item.products.image}
                                                alt={order_item.products.title}
                                                className="w-12 h-12 rounded-md object-cover border border-gray-200 dark:border-gray-700 bg-white"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{order_item.products.title}</h4>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Qty: {order_item.quantity}</span>
                                                    <span className="text-xs font-bold text-gray-900 dark:text-white">{order_item.price}€</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total Banner */}
                                <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950/40 p-4 rounded-lg mb-6 border border-blue-100/50 dark:border-blue-900/30">
                                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Total Price</span>
                                    <span className="text-xl font-extrabold text-blue-700 dark:text-blue-400">{order.totalPrice}€</span>
                                </div>

                                {/* Customer Details Panel */}
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Details</h3>
                                    <div className="space-y-1.5 text-sm">
                                        <p className="text-gray-800 dark:text-gray-200 font-semibold">{order.firstName} {order.lastName}</p>
                                        <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                                            <span className="text-gray-400">Email:</span> <span className="font-medium truncate max-w-[200px]">{order.email}</span>
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                                            <span className="text-gray-400">Tel:</span> <span className="font-medium">{order.tel}</span>
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300 flex justify-between">
                                            <span className="text-gray-400">Address:</span> <span className="font-medium text-right">{order.address}, {order.postalCode}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                {order.Status === "canceled" ? (
                                    <div className='flex gap-2'>
                                        <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 w-full">
                                            <MdCancel className="text-lg text-red-600" />
                                            <span className="text-xs font-bold text-red-700 dark:text-red-400">This Order Has Been Canceled</span>

                                        </div>
                                        <Form method='post'>
                                            <input type="hidden" name='action' value='delete_this_order' />
                                            <Button color='red' type='submit' name='order_id' value={order.id}>
                                                <MdDelete className='text-xl' />
                                                Delete
                                            </Button>
                                        </Form>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Update Status</span>
                                        <Form
                                            method="post"
                                            onChange={(event) => {
                                                let answer = confirm("Are you sure you want to update the Order Status?");
                                                if (answer) {
                                                    submit(event.currentTarget);
                                                }
                                            }}
                                            className="w-full max-w-[180px]"
                                        >
                                            <input type="hidden" name="action" value="update_state" />
                                            <input type="hidden" name="order_id" value={order.id} />
                                            <Select
                                                name="status"
                                                className="w-full"
                                                defaultValue={order.Status}
                                                sizing="sm"
                                            >
                                                {statusOptions?.map((stat_opt) => (
                                                    <option
                                                        key={stat_opt}
                                                        value={stat_opt}
                                                    >
                                                        {stat_opt}
                                                    </option>
                                                ))}
                                            </Select>
                                        </Form>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders