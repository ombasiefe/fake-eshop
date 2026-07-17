import type { OrdersStrategy } from "./orders.service";
import { orders_Status } from "@prisma/client";
import { prisma } from "~/db.server"

export class ManuelOrderStrategy implements OrdersStrategy {
    async add(data: {
        email: string, tel: string, userId: number, address: string, firstName: string, lastName: string, postalCode: string,
        items: { productId: number, quantity: number, price: number }[]
    }) {
        return await prisma.orders.create({
            data: {
                email: data.email.trim(),
                tel: data.tel.trim(),
                userId: data.userId,
                address: data.address.trim(),
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                postalCode: data.postalCode.trim(),
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        })
    }
    async edit(id: number, data: { status: orders_Status }) {
        return prisma.orders.update({
            where: { id: id },
            data: { Status: data.status }
        })
    }
    async delete(id: number) {
        return prisma.orders.delete({ where: { id } });
    }
}