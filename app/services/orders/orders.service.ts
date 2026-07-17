export interface OrdersStrategy {
    add(data: any): Promise<any>;
    edit(id: number, data: any): Promise<any>;
    delete(id: number): Promise<any>;
}

export class Orders {
    private strategy: OrdersStrategy;
    constructor(strategy: OrdersStrategy) {
        this.strategy = strategy
    }
    async addOrder(data: any) {
        return await this.strategy.add(data);
    }
    async editOrder(id: number, data: any) {
        return await this.strategy.edit(id, data);
    }
    async deleteOrder(id: number) {
        return await this.strategy.delete(id);
    }
}