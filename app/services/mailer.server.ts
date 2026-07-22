import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})


interface OrderItem {
    quantity: number;
    productTitle: string;
    productPrice: number;
    image?: string;
}

interface OrderConfirmationParams {
    customerEmail: string;
    customerName: string;
    orderId: number;
    totalAmount: number;
    items: OrderItem[];
}

export async function sendOrderConfirmationEmail({
    customerEmail,
    customerName,
    orderId,
    totalAmount,
    items
}: OrderConfirmationParams) {

    // Render individual item rows for the summary table
    const itemsListHtml = items.map(item => `
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                <div style="font-size: 14px; font-weight: 600; color: #0f172a;">${item.productTitle}</div>
                <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Qty: ${item.quantity}</div>
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; vertical-align: top; font-size: 14px; font-weight: 600; color: #0f172a;">
                ${(item.productPrice * item.quantity).toFixed(2)}€
            </td>
        </tr>
    `).join('');

    const mailOptions: nodemailer.SendMailOptions = {
        from: `"Oura Shop" <${process.env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Order Confirmed - #${orderId}`,
        text: `Hi ${customerName}, thank you for your order #${orderId}! Total: ${totalAmount.toFixed(2)}€`,
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            
            <!-- Main Wrapper -->
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
                <tr>
                    <td align="center">
                        
                        <!-- Container Card -->
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                            
                            <!-- Header / Banner -->
                            <tr>
                                <td style="background-color: #2563eb; padding: 32px 32px 28px 32px; text-align: left;">
                                    <div style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 12px;">
                                        OURA SHOP
                                    </div>
                                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                                        Thank you for your order!
                                    </h1>
                                    <p style="margin: 8px 0 0 0; font-size: 15px; color: #bfdbfe;">
                                        Hi ${customerName}, we've received order <strong style="color: #ffffff;">#${orderId}</strong> and are getting it ready.
                                    </p>
                                </td>
                            </tr>

                            <!-- Content Area -->
                            <tr>
                                <td style="padding: 32px;">
                                    
                                    <!-- Order Summary Header -->
                                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 12px;">
                                        Order Summary
                                    </div>

                                    <!-- Items Table -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                                        ${itemsListHtml}
                                    </table>

                                    <!-- Totals Box -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 8px; padding: 16px;">
                                        <tr>
                                            <td style="font-size: 15px; font-weight: 700; color: #0f172a;">
                                                Total Paid
                                            </td>
                                            <td style="font-size: 18px; font-weight: 800; color: #2563eb; text-align: right;">
                                                ${totalAmount.toFixed(2)}€
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Divider -->
                                    <div style="border-top: 1px solid #e2e8f0; margin: 28px 0 20px 0;"></div>

                                    <!-- Footer / Support Note -->
                                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; text-align: center;">
                                        Have questions about your purchase? Simply reply directly to this email and our team will be happy to help.
                                    </p>

                                </td>
                            </tr>

                            <!-- Sub-Footer -->
                            <tr>
                                <td style="background-color: #f1f5f9; padding: 16px 32px; text-align: center; font-size: 12px; color: #94a3b8;">
                                    © ${new Date().getFullYear()} Oura Shop. All rights reserved.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        //console.log(`Order Confirmation Email sent ${info.messageId}`)
        return { success: true }
    } catch (error) {
        console.error("Failed to send email", error)
        return { success: false, error }
    }
}