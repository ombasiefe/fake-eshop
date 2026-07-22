import type { CategoriesStrategy } from "./categories.service";
import { addCategory, deleteCategory, editCategory, prisma } from "~/db.server"

export class ManuelCategoryStrategy implements CategoriesStrategy {
    async add(data: { name: string }) {
        const existing = await prisma.categories.findFirst({
            where: { name: data.name }
        })
        if (existing) {
            throw new Response("A category with this name already exist.")

        }
        return addCategory(data.name)
    }
    async edit(id: number, data: { name: string }) {
        return editCategory(id, data.name)
    }
    async delete(id: number) {
        return deleteCategory(id);
    }


}