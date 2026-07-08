import React from 'react'
import { Form, type ActionFunctionArgs } from 'react-router'
import Sidebar from './Sidebar';
import { Outlet, redirect } from 'react-router';
import { getSession } from '~/session.server';
import type { Route } from './+types/AdminDashboard'
import { prisma } from "~/db.server"
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    const sesion = await getSession(request.headers.get("Cookie"))
    const userId = sesion.get("userId")
    console.log(userId)
    if (!userId) {
        return redirect('/login');
    }
    const isAdmin = await prisma.user.findUnique({
        where: { id: Number(userId), isAdmin: true }
    })
    if (!isAdmin?.isAdmin) {
        return redirect('/login')
    }

}
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
}



function AdminDashboard({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex h-screen w-screen overflow-hidden">

            <aside className="w-64 border-r shrink-0">
                <Sidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto p-8  bg-[#1d2a45]">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    )
}

export default AdminDashboard