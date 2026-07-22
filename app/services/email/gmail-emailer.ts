import { sendOrderConfirmationEmail } from "../mailer.server";
import type { EmailStrategy } from "./email.service";

export class GmailEmailerStrategy implements EmailStrategy {
    async send(
        data: { customerEmail: string, customerName: string, orderId: number, totalAmount: number, ProductRows: any[] }
    ) {
        return await sendOrderConfirmationEmail({
            customerEmail: data.customerEmail,
            customerName: data.customerName,
            orderId: data.orderId,
            totalAmount: Number(data.totalAmount),
            items: data.ProductRows
        })
    }
}