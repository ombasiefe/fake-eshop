export interface ProductsStrategy {
    add(data: any): Promise<any>;
    edit(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}

export class Product {
    private strategy: ProductsStrategy;
    constructor(strategy: ProductsStrategy) {
        this.strategy = strategy
    }
    async addProduct(data: any) {
        return await this.strategy.add(data);
    }
    async editProduct(id: number, data: any) {
        return await this.strategy.edit(id, data);
    }
    async deleteProduct(id: number) {
        return await this.strategy.delete(id);
    }
}