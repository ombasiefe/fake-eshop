import React from 'react'
import type { Route } from './+types/Logout'
import { Button, ButtonGroup, Card } from 'flowbite-react';
import { SlLogout } from "react-icons/sl";
import { Form, redirect } from 'react-router';
import { destroySession, getSession } from '~/lib/session.server';
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
        <div className='flex justify-center'>
            <Card className='w-max p-10 flex flex-col text-center'>
                <div className="flex justify-center mx-auto">
                    <img
                        className=" w-25 rounded-md"
                        src="/carousel_images/Oura_Navbar_Logo_2.png"
                        alt=""
                    />
                </div>
                <h2>Logout</h2>
                <p>Are you sure to Logout ?</p>
                <div className='flex gap-2 justify-center'>
                    <Button
                        style={{ backgroundColor: 'white' }}
                        className=' text-black '
                        href='/products'>No</Button>
                    <Form method="post">
                        <input type="hidden" name="action" value="logout" />
                        <Button
                            style={{ backgroundColor: "#AD9471" }}
                            className='flex gap-1'
                            type='submit'>
                            <SlLogout />
                            <span>Yes</span>
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    )
}

export default Logout