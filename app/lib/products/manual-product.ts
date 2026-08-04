import type { ProductsStrategy } from "./products.service";
import { addProduct_manually, deleteProduct, editProduct, prisma } from "~/lib/db.server"


export class ManuelProductStrategy implements ProductsStrategy {
    async add(data: { name: string, description: string, price: number, image: string, categoryId: number, isActive: boolean }) {
        const existing = await prisma.products.findFirst({
            where: { title: data.name }
        })
        if (existing) {
            throw new Response("A Product with this name already exist.")

        }
        return addProduct_manually(data)
    }
    async edit(id: number, data: { name: string, description: string, price: number, image: string, categoryId: number, isActive: boolean }) {
        return editProduct(id, data)
    }

    async delete(id: number) {
        return deleteProduct(id);
    }

}