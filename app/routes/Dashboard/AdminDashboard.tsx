import React from 'react'
import { Form, type ActionFunctionArgs } from 'react-router'
import Sidebar from './Sidebar';
import { Outlet } from 'react-router';
type Props = {}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const actionType = formData.get("action")
}



function AdminDashboard({ }: Props) {
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