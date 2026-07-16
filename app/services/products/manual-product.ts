import type { ProductsStrategy } from "./products.service";
import { prisma } from "~/db.server"

export class ManuelProductStrategy implements ProductsStrategy {
    async add(data: { name: string, description: string, price: number, image: string, categoryId: number, isActive: boolean }) {
        const existing = await prisma.products.findFirst({
            where: { title: data.name }
        })
        if (existing) {
            throw new Response("A Product with this name already exist.")

        }
        return await prisma.products.create({
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
    async edit(id: number, data: { name: string, description: string, price: number, image: string, categoryId: number, isActive: boolean }) {
        return await prisma.products.upsert({
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

    async delete(id: number) {
        return await prisma.products.delete({
            where: { id }
        })
    }


}