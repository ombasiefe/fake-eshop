import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
}
let prisma: PrismaClient
if (!globalForPrisma.prisma) {
    const adapter = new PrismaMariaDb({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
    })
    globalForPrisma.prisma = new PrismaClient({ adapter })
}
prisma = globalForPrisma.prisma


export async function getUserOrders({ user_id }: { user_id: number }) {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                items: {
                    include: { products: true }
                }
            }, where: { userId: user_id },
            orderBy: { createdAt: 'desc' }
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
export { prisma }