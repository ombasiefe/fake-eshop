import React from 'react'
import { getUserId } from '~/session.server'
import type { Route } from './+types/UserOrders'
import { getUserOrders, prisma } from '~/db.server';
import { Button, Card, Badge } from 'flowbite-react';
import { Form, useNavigation } from 'react-router';
import { MdCancel, MdLocalPhone, MdOutlineEmail, MdOutlineLocationOn } from 'react-icons/md';
import prismaClientPkg from "@prisma/client"

const { orders_Status } = prismaClientPkg
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
                            Status: orders_Status.canceled
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
    const { orders } = loaderData?.orders || []
    const success = actionData?.success
    const navigation = useNavigation();

    // Helper to style Flowbite Badges based on order status
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "warning";
            case "completed":
            case "delivered":
                return "success";
            case "canceled":
                return "failure";
            default:
                return "indigo";
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
                Your Orders
            </h1>

            {orders?.length === 0 ? (
                <Card className="text-center py-16">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No orders found!</p>
                </Card>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders?.map((order) => {
                        const isPending = order.Status === "pending";
                        const isSubmittingThisOrder =
                            navigation.state === "submitting" &&
                            navigation.formData?.get("orderId") === String(order.id);

                        return (
                            <Card key={order?.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">

                                {/* Card Header */}
                                <div className="flex flex-wrap justify-between items-center pb-4 border-b border-gray-150 dark:border-gray-700">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold tracking-wider uppercase">ORDER REFERENCE</span>
                                        <span className="text-lg font-bold text-gray-800 dark:text-white">#{order.id}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                        <div className="text-sm text-right">
                                            <p className="text-gray-400 dark:text-gray-500 text-xs uppercase font-semibold">Placed On</p>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                                {order.createdAt.toLocaleDateString("en-GB")} {order.createdAt.toLocaleTimeString("en-GB", { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <Badge size="md" color={getStatusColor(order.Status)} className="uppercase px-3 py-1 font-bold">
                                            {order.Status}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Card Body: Two-Column Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">

                                    {/* Left Side: Product Items List */}
                                    <div className="md:col-span-2 flex flex-col gap-4">
                                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Items Ordered</h3>
                                        <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[340px] overflow-y-auto pr-2">
                                            {order?.items.map((orderItem) => (
                                                <div className="flex items-center gap-4 py-3 first:pt-0 last:pb-0" key={orderItem.id}>
                                                    <img
                                                        src={orderItem.products.image}
                                                        alt={orderItem.products.title}
                                                        className="h-16 w-16 object-contain rounded-lg border border-gray-100 dark:border-gray-800 p-1 bg-white"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate">{orderItem.products?.title}</h4>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                            Qty: <span className="font-medium text-gray-800 dark:text-gray-200">{orderItem.quantity}</span> &middot; {orderItem.price.toFixed(2)}€ each
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-gray-900 dark:text-white">
                                                            {(orderItem.quantity * orderItem.price).toFixed(2)}€
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Side: Shipping Information Card */}
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-5 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 pb-1 border-b border-gray-200/50 dark:border-gray-700">Shipping Details</h3>
                                            <div className="flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="flex items-center gap-2.5">
                                                    <MdOutlineEmail className="text-gray-400 text-lg flex-shrink-0" />
                                                    <span className="truncate" title={order.email}>{order.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2.5">
                                                    <MdLocalPhone className="text-gray-400 text-lg flex-shrink-0" />
                                                    <span>{order.tel}</span>
                                                </div>
                                                <div className="flex items-start gap-2.5">
                                                    <MdOutlineLocationOn className="text-gray-400 text-lg flex-shrink-0 mt-0.5" />
                                                    <span>{order.address}, {order.postalCode}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-end">
                                            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Price</span>
                                            <span className="text-2xl font-black text-gray-900 dark:text-white">{order.totalPrice}€</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer: Action Bar */}
                                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                                    {!isPending ? (
                                        <div className="text-xs text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-md">
                                            Status is {order.Status}. This order can no longer be updated.
                                        </div>
                                    ) : (
                                        <Form method="post">
                                            <input type="hidden" name="action" value="cancel_order" />
                                            <Button
                                                type="submit"
                                                color="red"
                                                size="sm"
                                                name="orderId"
                                                value={order.id}
                                                disabled={isSubmittingThisOrder}
                                            >
                                                <MdCancel className="text-lg mr-2" />
                                                {isSubmittingThisOrder ? "Cancelling..." : "Cancel Order"}
                                            </Button>
                                        </Form>
                                    )}
                                </div>

                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default UserOrders