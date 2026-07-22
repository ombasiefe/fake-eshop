export interface EmailStrategy {
    send(data: any): Promise<any>
}
export class Email {
    private strategy: EmailStrategy
    constructor(strategy: EmailStrategy) {
        this.strategy = strategy
    }
    async sendEmail(data: any) {
        return await this.strategy.send(data);
    }

} 