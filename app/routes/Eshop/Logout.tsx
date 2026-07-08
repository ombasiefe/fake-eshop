import React from 'react'
import type { Route } from './+types/Logout'
import { Button, ButtonGroup } from 'flowbite-react';
import { SlLogout } from "react-icons/sl";
import { Form, redirect } from 'react-router';
import { destroySession, getSession } from '~/session.server';
type Props = {}
export async function action({ request }: Route.LoaderArgs) {
    const formData = await request.formData();
    const actionType = formData.get("action");

    if (actionType === "logout") {
        const session = await getSession(
            request.headers.get("Cookie"),
        );
        return redirect("/", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    }
}
function Logout({ }: Props) {

    return (
        <div className='w-fit bg-transparent'>
            <h2>Logout</h2>
            <p>Are you sure to Logout ?</p>
            <div className='flex gap-2'>
                <Button color="red" href='/products'>No</Button>
                <Form method="post">
                    <input type="hidden" name="action" value="logout" />
                    <Button className='flex gap-1' type='submit'>
                        <SlLogout />
                        <span>Yes</span>
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default Logout