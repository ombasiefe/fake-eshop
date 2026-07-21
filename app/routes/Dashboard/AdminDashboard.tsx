import React from 'react'
import { Form, type ActionFunctionArgs } from 'react-router'
import { AdminSidebar as Sidebar } from './AdminSidebar';
import { Outlet, redirect } from 'react-router';
import { getSession } from '~/session.server';
import type { Route } from './+types/AdminDashboard'
import { prisma } from "~/db.server"
import DashboardError from '../errors/Dashboard_Errors/DashboardError';
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const userId = session.get("userId");
    if (!userId) return redirect('/login');

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId), isAdmin: true }
        });
        if (!user?.isAdmin) return redirect('/login');
        return { user };
    } catch (e) {
        console.error("Admin check failed:", e);
        return null;
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
    console.log("=== LAYOUT BOUNDARY ===", error);
    return <h1 style={{ color: 'red' }}>LAYOUT</h1>;
}