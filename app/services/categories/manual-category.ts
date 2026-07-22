import type { CategoriesStrategy } from "./categories.service";
import { prisma } from "~/db.server"

export class ManuelCategoryStrategy implements CategoriesStrategy {
    async add(data: { name: string }) {
        const existing = await prisma.categories.findFirst({
            where: { name: data.name }
        })
        if (existing) {
            throw data("A category with this name already exist.")

        }
        return await prisma.categories.create({
            data: {
                name: data.name.trim()
            }
        })
    }
    async edit(id: number, data: { name: string }) {
        return await prisma.categories.update({
            where: { id },
            data: { name: data.name.trim() }
        })
    }
    async delete(id: number) {
        const prodCount = await prisma.products.count({ where: { categoryId: id } })
        if (prodCount > 0) {
            throw data("Cannot delete category: It still contains active products.")
        }
        return await prisma.categories.delete({
            where: { id }
        })
    }


}