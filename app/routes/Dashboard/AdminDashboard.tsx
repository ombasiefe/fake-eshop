import React from 'react'
import { data, Form, type ActionFunctionArgs } from 'react-router'
import { AdminSidebar as Sidebar } from './AdminSidebar';
import { Outlet, redirect } from 'react-router';
import { getUserId } from '~/session.server';
import type { Route } from './+types/AdminDashboard'
import { isAdminCheck } from "~/db.server"
import DashboardError from '../errors/Dashboard_Errors/DashboardError';
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    const userId = await getUserId(request);
    if (!userId) return redirect('/login');

    try {
        const admin = isAdminCheck(userId)
        if (!admin) return redirect('/login');
        return { admin };
    } catch (e) {
        throw data('admin check failed');
    }
}
export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
}



export default function AdminDashboard({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex h-screen w-screen overflow-hidden">

            <aside className=" border-r shrink-0 bg-[#1D2A45]">
                <Sidebar />
            </aside>

            <main className="flex-1 h-full overflow-y-auto p-8  bg-[#1d2a45]">
                <div className="max-w-9xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    return <DashboardError error={error} />
}