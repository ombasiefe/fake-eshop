import React from 'react'
import type { Route } from "./+types/ReplyNotification"
import { data, Form, Link, redirect } from 'react-router'
import { getUniqueNotification, setAdminNotificationRead } from '~/db.server'
import { Alert, Card, Badge, Label, TextInput, Textarea, Button } from 'flowbite-react'
import { HiArrowLeft, HiCheckCircle, HiExclamation, HiPaperAirplane } from 'react-icons/hi'
import { sendEmail } from '~/services/mailer.server'
//import { GmailEmailerStrategy } from '~/services/email/gmail-emailer'

type Props = {}
export async function loader({ params }: Route.LoaderArgs) {
    const notification_id = Number(params.id)
    let notification = null
    try {
        notification = (await getUniqueNotification(notification_id)).not_details
        if (!notification) {
            //console.error("Error fetching the product details from db")
            throw data("Notification not found ", { status: 404 })

        }
    } catch (e) {
        if (e instanceof Response) {
            throw e
        }
        throw data('Server Communication Failed', { status: 500 })
    }
    return { notification }
}
export async function action({ request }: Route.ActionArgs) {
    //  const service = new GmailEmailerStrategy;
    const formData = await request.formData();
    const notificationId = Number(formData.get('notificationId'));
    const recipientEmail = formData.get('recipientEmail') as string
    const subject = formData.get('subject') as string
    const replyMessage = formData.get('replyMessage') as string

    if (subject.length === 0 && replyMessage.length === 0) {
        return null
    }

    const notification = await getUniqueNotification(notificationId);
    try {
        await sendEmail("smtp", {
            to: recipientEmail,
            subject: `New message from Oura Shop`,
            text: `Hello ${notification.not_details?.name},

Thank you for contacting Oura Shop.

Regarding your previous message, here is our response:

${replyMessage}

If you have any additional questions, simply reply to this email and we'll be happy to help.

Best regards,
The Oura Shop Team`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f7fb;">
        <tr>
            <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

                    <!-- Header -->
                    <tr>
                        <td style="background:#2563eb;padding:30px;">
                            <h1 style="margin:0;color:#ffffff;font-size:24px;">
                                Oura Shop
                            </h1>
                            <p style="margin:8px 0 0;color:#dbeafe;font-size:15px;">
                                Reply to your message
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:35px;">

                            <p style="font-size:16px;color:#111827;">
                                Hello <strong>${notification.not_details?.name}</strong>,
                            </p>

                            <p style="font-size:15px;color:#4b5563;line-height:1.7;">
                                Thank you for contacting <strong>Oura Shop</strong>.
                                We appreciate you taking the time to reach out to us.
                            </p>

                            <p style="font-size:15px;color:#4b5563;line-height:1.7;">
                                Regarding your inquiry, here is our response:
                            </p>

                            <div style="
                                background:#f8fafc;
                                border-left:4px solid #2563eb;
                                padding:18px;
                                margin:25px 0;
                                color:#111827;
                                line-height:1.8;
                                white-space:pre-line;
                            ">
                                ${replyMessage}
                            </div>

                            <p style="font-size:15px;color:#4b5563;line-height:1.7;">
                                If you need any further assistance, simply reply to this email.
                                We'll be happy to help.
                            </p>

                            <p style="margin-top:35px;font-size:15px;color:#111827;">
                                Best regards,<br>
                                <strong>Oura Shop Support Team</strong>
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f8fafc;padding:18px;text-align:center;font-size:12px;color:#6b7280;">
                            © ${new Date().getFullYear()} Oura Shop. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
`
        })
        await setAdminNotificationRead({ notificationId })
        redirect('admin/notifications');
    } catch (e) {
        console.error('An error occured while replying to this notification !', e)
    }
}

function ReplyNotification({ loaderData }: Route.ComponentProps) {
    const notification = loaderData.notification
    return (
        <div>
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">

                <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 dark:border-gray-700 pb-4 gap-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Notification #{notification.id}
                                </h1>
                                <Badge color="info">{notification?.reason}</Badge>
                            </div>

                        </div>
                    </div>

                    {/* Sender Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm">
                        <div>
                            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                From
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {notification.name}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                Email
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {notification.email}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                Phone
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {notification.tel || 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* Message Body */}
                    <div className="mt-2">
                        <Label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                            Message
                        </Label>
                        <div className="mt-2 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-800 dark:text-gray-200 text-sm whitespace-pre-line leading-relaxed">
                            {notification.message}
                        </div>
                    </div>
                </Card>

                {/* Admin Reply Form */}
                <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        Reply to Inquiry
                    </h2>

                    <Form method="post" className="space-y-4">
                        {/* Hidden inputs to send reference IDs */}
                        <input type="hidden" name="notificationId" value={notification.id} />
                        <input type="hidden" name="recipientEmail" value={notification.email} />

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="subject" defaultValue="Subject" />
                            </div>
                            <TextInput
                                id="subject"
                                name="subject"
                                type="text"
                                defaultValue={`Re: ${notification.reason} (Notification #${notification.id})`}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="replyMessage" defaultValue="Your response" />
                            </div>
                            <Textarea
                                id="replyMessage"
                                name="replyMessage"
                                placeholder="Type your response here..."
                                rows={6}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Link to="/admin/notifications">
                                <Button color="gray" type="button">
                                    Cancel
                                </Button>
                            </Link>


                            <Button color="blue" type="submit" className="flex items-center gap-2">
                                <HiPaperAirplane className="h-4 w-4 rotate-90" />
                                Send Reply
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default ReplyNotification