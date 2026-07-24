import { Button, Card } from 'flowbite-react'
import React, { useEffect } from 'react'
import type { Route } from "./+types/Notifications"
import { getNotifications, setAdminNotificationRead } from '~/db.server';
import { Form, redirect, useFetcher } from 'react-router';
import { MdMarkEmailRead } from 'react-icons/md';
import { LuMessageSquareReply } from "react-icons/lu";

type Props = {}
export async function loader({ }: Route.LoaderArgs) {
    const notifications = (await getNotifications());
    return notifications
}
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const actionType = formData.get('actionType') as string
    const notificationId = Number(formData.get("not_Id"))

    switch (actionType) {
        case "mark_as_read":
            console.log('as read')
            const result = setAdminNotificationRead({ notificationId })
            if ((await (result)).success) {
                return { success: true }
            }
            break;
        case "reply_to_this":
            console.log('reply ')
            if (!notificationId) return { error: 'Notification not found' }
            return redirect(`${notificationId}`)
    }


}

function Notifications({ loaderData }: Route.ComponentProps) {
    const notification = loaderData.data
    const fetcher = useFetcher();
    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-center text-2xl'>Notifications</h1>

            {notification?.map((not) => (
                not.isRead === false ? (
                    <Card key={not.id} >
                        <div className='flex flex-col'>
                            <div className='flex justify-between'>
                                <h2 className='text-xl'>From: {not.from}</h2>
                                <span>reason: {not.reason}</span>
                            </div>
                            <div>
                                <h3>Message:</h3>
                                <p>{not.message}</p>
                            </div><hr />
                            <h4>Sender contact details:</h4>
                            <div>
                                <span> Name: {not.name} Surname: {not.surname}</span><br />
                                <span>email: {not.email} Phone: {not.tel}</span>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <fetcher.Form method='post'>

                                <input type="hidden" name='actionType' value="mark_as_read" />
                                <button type='submit' name="not_Id" value={not.id}
                                    className='flex bg-green-500 p-2 rounded-2xl'>
                                    <MdMarkEmailRead className='text-2xl mx-1' />
                                    Mark as read
                                </button>
                            </fetcher.Form>
                            <fetcher.Form method='post'>
                                <input type="hidden" name='actionType' value="reply_to_this" />
                                <button type='submit' name="not_Id" value={not.id}
                                    className='flex bg-blue-600 p-2 rounded-2xl'>
                                    <LuMessageSquareReply className='text-2xl mx-1' />
                                    Reply..
                                </button>
                            </fetcher.Form>
                        </div>
                    </Card>
                ) : (
                    <div><Card key={not.id} >

                        <div className='flex flex-col'>
                            <div className='flex justify-between'>
                                <h2 className='text-xl'>From: {not.from}</h2>
                                <span>reason:{not.reason}</span>
                            </div>
                            <div>
                                <h3>Message:</h3>
                                <p>{not.message}</p>
                            </div><hr />
                            <h4>Sender contact details:</h4>
                            <div>
                                <span> Name: {not.name} Surname: {not.surname}</span><br />
                                <span>email: {not.email} Phone: {not.tel}</span>
                            </div>
                        </div>
                    </Card>
                    </div>)
            ))}

        </div>
    )
}

export default Notifications