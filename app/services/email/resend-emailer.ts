import type { EmailStrategy } from "./email.service";
import { Resend } from "resend";

export class ResendEmailerStrategy implements EmailStrategy {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(String(process.env.RESEND_API_KEY));
    }

    async send(data: {
        first_name: string, last_name: string, email: string, phone: string, address: string, postal_code: string, total_price: number, productRows: any[]
    }) {
        return await this.resend.emails.send({
            from: String(process.env.RESEND_FROM),
            to: String(process.env.RESEND_TO),
            subject: `🛒 New Order from ${data.first_name} ${data.last_name}`,
            html: `
<!DOCTYPE html>
<html>
<head>
<style>
body{
    font-family:Arial,sans-serif;
    background:#f4f4f4;
    padding:30px;
}

.container{
    max-width:700px;
    margin:auto;
    background:#fff;
    border-radius:10px;
    padding:30px;
    box-shadow:0 3px 10px rgba(0,0,0,.1);
}

h1{
    color:#2563eb;
    margin-bottom:25px;
}

.section{
    margin-bottom:25px;
}

.info-table{
    width:100%;
    border-collapse:collapse;
}

.info-table td{
    padding:8px;
    border-bottom:1px solid #eee;
}

.products{
    width:100%;
    border-collapse:collapse;
    margin-top:15px;
}

.products th{
    background:#2563eb;
    color:white;
    padding:10px;
}

.products td{
    padding:10px;
    border-bottom:1px solid #ddd;
}

.total{
    margin-top:25px;
    text-align:right;
    font-size:20px;
    font-weight:bold;
}

.footer{
    margin-top:30px;
    color:#777;
    font-size:14px;
}
</style>
</head>

<body>

<div class="container">

<h1>🛒 New Order Received</h1>

<div class="section">

<h2>Customer Details</h2>

<table class="info-table">
<tr>
<td><strong>Name</strong></td>
<td>${data.first_name} ${data.last_name}</td>
</tr>

<tr>
<td><strong>Email</strong></td>
<td>${data.email}</td>
</tr>

<tr>
<td><strong>Phone</strong></td>
<td>${data.phone}</td>
</tr>

<tr>
<td><strong>Address</strong></td>
<td>${data.address}</td>
</tr>

<tr>
<td><strong>Postal Code</strong></td>
<td>${data.postal_code}</td>
</tr>

</table>

</div>

<h2>Ordered Products</h2>

<table class="products">

<thead>
<tr>
<th>Product</th>
<th>Qty</th>
<th>Price</th>
<th>Subtotal</th>
</tr>
</thead>

<tbody>
${data.productRows}
</tbody>

</table>

<div class="total">
Total: €${Number(data.total_price).toFixed(2)}
</div>

<div class="footer">
Order generated from your webshop.
</div>

</div>

</body>
</html>
`,
        });
    }
}       
