export interface CategoriesStrategy {
    add(data: any): Promise<any>;
    edit(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}

export class Category {
    private strategy: CategoriesStrategy;
    constructor(strategy: CategoriesStrategy) {
        this.strategy = strategy
    }
    async addCategory(data: any) {
        return await this.strategy.add(data);
    }
    async editCategory(id: number, data: any) {
        return await this.strategy.edit(id, data);
    }
    async deleteCategory(id: number) {
        return await this.strategy.delete(id);
    }
}