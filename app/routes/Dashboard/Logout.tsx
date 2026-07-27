import React from 'react'
import type { Route } from './+types/Logout'
import {
    adminLogout,
} from "../../lib/session.server"
import { Form, redirect, Link, data } from 'react-router'
type Props = {}
export async function action({
    request,
}: Route.ActionArgs) {
    try {
        return await adminLogout(request);
    } catch (e) {
        console.error('Hello')
    }
}

export default function Logout({ }: Props) {
    return (
        <div className='flex flex-col justify-center items-center border p-2 h-50 rounded-md gap-4'>
            <p className='text-lg'>Are you sure you want to log out?</p>
            <div className='flex gap-8'>
                <Form method="post" className='p-2 bg-red-700 rounded-md'>
                    <button type='submit'>Logout</button>
                </Form>
                <Link to="/admin"
                    className='p-2 bg-blue-700 rounded-md'
                >Never mind
                </Link>
            </div>
        </div>

    )
}