import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'

type Props = {}

function EshopMain({ }: Props) {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden">

            <nav className="h-15 border-r shrink-0">
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