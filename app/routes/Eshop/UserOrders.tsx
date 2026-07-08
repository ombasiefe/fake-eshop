import React from 'react'
import { getUserId } from '~/session.server'
import type { Route } from './+types/UserOrders'
import { getUserOrders } from '~/db.server';
type Props = {}
export async function loader({ request }: Route.LoaderArgs) {
    const user_id = await getUserId(request);
    const userId = Number(user_id)
    console.log(userId)
    const Orders = await getUserOrders({ user_id: userId });
    return { orders: Orders }
}
function UserOrders({ loaderData }: Route.ComponentProps) {
    const { orders } = loaderData.orders
    return (
        <div className='flex flex-col gap-2 '>
            {orders?.length === 0 ? (
                <p>No Order found !</p>
            ) : (
                orders?.map((order) => (
                    <div key={order?.id} className='flex border items-center rounded-md p-1 gap-1'  >
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
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default UserOrders