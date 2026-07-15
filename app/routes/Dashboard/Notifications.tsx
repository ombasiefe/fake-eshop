import { Button, Card } from 'flowbite-react'
import React, { useEffect } from 'react'
import type { Route } from "./+types/Notifications"
import { getNotifications, setAdminNotificationRead } from '~/db.server';
import { Form } from 'react-router';
import { MdMarkEmailRead } from 'react-icons/md';
type Props = {}
export async function loader({ }: Route.LoaderArgs) {
    const notifications = getNotifications();
    return notifications
}
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const notificationId = Number(formData.get("not_Id"))
    const result = setAdminNotificationRead({ notificationId })
    if ((await (result)).success) {
        return { success: true }
    }

}

function Notifications({ loaderData, actionData }: Route.ComponentProps) {
    const notification = loaderData.data

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
                        <Form method='post'>
                            <input type="hidden" name="not_Id" value={not.id} />
                            <Button type='submit'>
                                <MdMarkEmailRead className='text-2xl mx-1' />
                                Mark as read
                            </Button>
                        </Form>
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