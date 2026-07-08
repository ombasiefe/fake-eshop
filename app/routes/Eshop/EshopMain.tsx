import React from 'react'
import Navbar from './Navbar'
import { Outlet, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { prisma } from '~/db.server';
import { getSession } from '~/session.server';

type Props = {}
export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const session = await getSession(request.headers.get('Cookie'));
        const userId = Number(session.get('userId'))
        if (!userId) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            console.error("user not found !")
        }

        return { user: user }
    } catch (e) {
        console.error("An error occured while loading this page:", e)
    }
}

function EshopMain({ }: Props) {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">

            <nav className=" border-r shrink-0">
                <Navbar />
            </nav>
            <main className="flex-1 h-full overflow-y-auto p-8  bg-[#1d2a45]">
                <div className="max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    )
}

export default EshopMain