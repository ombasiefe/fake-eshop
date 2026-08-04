import "dotenv/config"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { orders_Status, PrismaClient } from "@prisma/client";
import { data } from "react-router";
import bcrypt from "bcryptjs";

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


//---------------Eshop Queries-----------------

export async function getEshopHomeProducts() {
    const products = await prisma.products.findMany({
        where: { isActive: true },
        take: 5
    });
    return products
}
export async function findUser(userId: number) {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    return { user: user }


}
export async function getUserOrders({ user_id }: { user_id: number }) {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                items: {
                    include: { products: true }
                }
            }, where: { userId: user_id },
            orderBy: {
                createdAt: 'desc'
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
export async function getEshopProducts(page: number, pageSize: number) {
    const products = await prisma.products.findMany({
        where: { isActive: true },
        skip: (page - 1) * pageSize,
        take: pageSize
    });
    return { products }
}

export async function DoesUserExist(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    })
    return user
}

//----------Dashboard----------------
//Admin Products 
export async function getProducts(page: number, pageSize: number, totalPages: number) {
    try {
        const Db_products = await prisma.products.findMany({
            include: { category: true },
            skip: (page - 1) * pageSize,
            take: pageSize
        });

        return { data: Db_products };
    } catch (e) {
        if (e instanceof Response) {
            throw e
        }
        console.error("Error caused by: ", e)
        throw data("Database error", { status: 500 });
    }

}
export async function addProducts_from_api(apiProducts: any) {
    try {
        const category_names = [...new Set(apiProducts.map((prod: any) => prod.category))] as string[]
        //console.log(category_names)
        await Promise.all(
            category_names.map((name) =>
                prisma.categories.upsert({
                    where: { name: name },
                    update: {},
                    create: { name: name },
                })
            )
        )
        //console.log("the category inserted")
        const categories = await prisma.categories.findMany({
            where: {
                name: { in: category_names }
            }
        });
        // //console.log(categories)
        const categoryMap = Object.fromEntries(categories.map(c => [c.name, c.id]))
        const transformedData = apiProducts.map((item: any) => {
            const catId = categoryMap[item.category.trim()];
            if (!catId) {
                throw new Error(`Category ID mapping failed for category: ${item.category}`)
            }
            return {
                title: item.title,
                description: item.description,
                price: item.price,
                image: item.image,
                categoryId: catId
            }
        })
        await prisma.products.createMany({
            data: transformedData,
            skipDuplicates: true,
        })
        ////console.log("transfromed Data:", transformedData)

        //console.log("Products inserted successfully")
    } catch (e) {
        console.error("Product insert failed:", e)
    }
}
export async function addProduct_manually(data: { name: string, description: string, price: number, image: string, categoryId: number, isActive: boolean }) {
    await prisma.products.create({
        data: {
            title: data.name.trim(),
            description: data.description.trim(),
            price: data.price,
            image: data.image.trim(),
            categoryId: data.categoryId,
            isActive: data.isActive
        }
    })

}
export async function editProduct(id: number, data: { name: string, description: string, price: number, image: string, categoryId: number, isActive: boolean }) {
    await prisma.products.upsert({
        where: { id },
        update: {
            title: data.name.trim(),
            description: data.description.trim(),
            price: data.price,
            image: data.image.trim(),
            isActive: data.isActive,
            categoryId: data.categoryId
        },
        create: {
            title: data.name.trim(),
            description: data.description.trim(),
            price: data.price,
            image: data.image.trim(),
            isActive: data.isActive,
            categoryId: data.categoryId
        }
    })
}
export async function getUniqueProduct(product_id: number) {
    return await prisma.products.findUnique({
        where: { id: product_id },
        include: { category: true }
    })
}
export async function deleteProduct(id: number) {
    await prisma.products.delete({
        where: { id }
    })
}
//Admin Dashboard 
export async function isAdminCheck(userId: number) {
    const admin = await prisma.user.findUnique({
        where: { id: Number(userId), isAdmin: true }
    });
    return { Admin: admin?.isAdmin }
}
// Admin Categories
export async function getCategories() {
    const categories = await prisma.categories.findMany()
    return { data: categories }
}

export async function addCategory(name: string) {
    await prisma.categories.create({
        data: {
            name: data.name.trim()
        }
    })
}

export async function editCategory(id: number, name: string) {
    await prisma.categories.update({
        where: { id },
        data: { name: data.name.trim() }
    })
}
export async function deleteCategory(id: number) {
    const prodCount = await prisma.products.count({ where: { categoryId: id } })
    if (prodCount > 0) {
        throw new Response("Cannot delete category: It still contains active products.")
    }
    await prisma.categories.delete({
        where: { id }
    })
}
//Admin Dashboard Charts data
export async function getRawChartData() {
    const data = await prisma.orderschartdata.findMany({
        orderBy: {
            date: 'asc'
        }
    });
    return { data }
}
export async function getCategoriesChartData() {
    const data = await prisma.productsbycategorychartdata.findMany();
    return { data }
}

export async function getOrderStatusChartData() {
    const data = await prisma.orderstatuschart.findMany();
    return { data }
}
// Admin notifications 
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

export async function getUniqueNotification(notification_id: number) {
    const not_details = await prisma.notifications.findUnique({
        where: { id: notification_id }
    })
    return { not_details }
}
// ----------------Orders --------------------------------------
export async function getAdminOrders() {
    const orders = await prisma.orders.findMany({
        include: {
            items: {
                include: { products: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })
    return { data: orders }
}

export async function addOrders(data: {
    email: string, tel: string, userId: number, address: string, firstName: string, lastName: string, postalCode: string,
    items: { productId: number, quantity: number, price: number }[]
}) {
    try {
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
    } catch (e) {
        console.error('Error while adding new order !', e)
        return null
    }
}

export async function editOrdersStatus(id: number, data: { status: orders_Status }) {
    const orderStatus = await prisma.orders.update({
        where: { id: id },
        data: { Status: data.status }
    })
    return { data: orderStatus }
}

export async function deleteOrders(id: number) {
    await prisma.orders.delete({ where: { id } });
}


//-------------Register--------
export async function addNewUser(new_email: string, new_password: string) {
    const hashedPassword = await bcrypt.hash(new_password, 10)
    const new_User = await prisma.user.create({
        data: {
            email: new_email,
            password: hashedPassword
        }
    })

}
export { prisma }
