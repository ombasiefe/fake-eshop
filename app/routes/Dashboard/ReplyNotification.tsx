import React from 'react'
import type { Route } from "./+types/ReplyNotification"
import { data, Form, Link } from 'react-router'
import { getUniqueNotification } from '~/db.server'
import { Alert, Card, Badge, Label, TextInput, Textarea, Button } from 'flowbite-react'
import { HiArrowLeft, HiCheckCircle, HiExclamation, HiPaperAirplane } from 'react-icons/hi'
import { GmailEmailerStrategy } from '~/services/email/gmail-emailer'

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
    const service = new GmailEmailerStrategy;
    const formData = await request.formData();
    const notificationId = Number(formData.get('notificationId'));
    const recipientEmail = formData.get('recipientEmail') as string
    const subject = formData.get('subject') as string
    const replyMessage = formData.get('replyMessage') as string

    if (subject.length === 0 && replyMessage.length === 0) {
        return null
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