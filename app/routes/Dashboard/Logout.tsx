import React from 'react'
import type { Route } from './+types/Logout'
import {
    getSession,
    destroySession,
} from "../../session.server"
import { Form, redirect, Link } from 'react-router'
type Props = {}
export async function action({
    request,
}: Route.ActionArgs) {
    const session = await getSession(
        request.headers.get("Cookie"),
    );
    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session),
        },
    });
}

function Logout({ }: Props) {
    return (
        <div className='flex flex-col justify-center items-center border p-2 h-50 rounded-md gap-4'>
            <p className='text-lg'>Are you sure you want to log out?</p>
            <div className='flex gap-8'>
                <Form method="post" className='p-2 bg-red-700 rounded-md'>
                    <button>Logout</button>
                </Form>
                <Link to="/admin"
                    className='p-2 bg-blue-700 rounded-md'
                >Never mind
                </Link>
            </div>
        </div>

    )
}

export default Logout