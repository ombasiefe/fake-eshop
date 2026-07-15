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
interface ContactFormProps {
    email: string;
    name: string;
    surname: string;
    tel: string;
    contact_reason: string;
    message: string;
}
export async function ContactFormSubmit({ email, name, surname, tel, contact_reason, message }: ContactFormProps): Promise<{ success: boolean }> {
    try {
        const formSubmitted = await prisma.notifications.create({
            data: {
                email: email,
                name: name,
                surname: surname,
                tel: tel,
                reason: contact_reason,
                message: message
            }
        })

        return { success: true }
    } catch (e) {
        console.error("An Error occured while sending the contact-form:", e)
        return { success: false }

    }
}
export async function getNotifications() {
    try {
        const notifications = await prisma.notifications.findMany({
            orderBy: { isRead: 'asc' }
        });
        return { data: notifications }
    } catch (e) {
        console.error("An error occured while fetching the notifications from db", e)
        return { data: null }
    }


}
export async function setAdminNotificationRead({ notificationId }: { notificationId: number }) {
    try {
        await prisma.notifications.update({
            where: { id: notificationId },
            data: { isRead: true },
        })
        return { success: true }
    } catch (e) {
        console.error("An error occured while updating the notification read status", e)
        return { success: false }
    }
}

export { prisma }
