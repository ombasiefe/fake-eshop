import type { OrdersStrategy } from "./orders.service";
import { orders_Status } from "@prisma/client";
import { addOrders, deleteOrders, editOrdersStatus, prisma } from "~/db.server"

export class ManuelOrderStrategy implements OrdersStrategy {
    async add(data: {
        email: string, tel: string, userId: number, address: string, firstName: string, lastName: string, postalCode: string,
        items: { productId: number, quantity: number, price: number }[]
    }) {
        addOrders(data);
    }
    async edit(id: number, data: { status: orders_Status }) {
        return editOrdersStatus(id, data)
    }
    async delete(id: number) {
        return deleteOrders(id)
    }
}