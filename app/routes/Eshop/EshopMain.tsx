import React from 'react'
import Navbar from './Navbar'
import { Outlet, type LoaderFunctionArgs } from 'react-router'
import { prisma } from '~/db.server';
import { getSession } from '~/session.server';
import { Footer } from './Footer';

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
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0F172A] text-slate-50 antialiased">

            {/* Navbar: Translucent Midnight Blue background with a subtle Champagne Gold bottom border */}
            <nav className="border-b border-[#C5A880]/10 bg-[#1D2A45]/50 backdrop-blur-md shrink-0 z-50">
                <Navbar />
            </nav>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto bg-[#0F172A]">
                {/* Inner Flex Wrapper - Forces content to span at least the full height */}
                <div className="flex flex-col min-h-full">

                    {/* Main Content - Smooth vertical padding and clean spacing */}
                    <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>

                    {/* Sticky Footer: Sits elegantly at the bottom with a matching gold-tinted top border */}
                    <footer className="shrink-0 border-t border-[#C5A880]/10 bg-[#1D2A45]/30 py-8 mt-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <Footer />
                        </div>
                    </footer>

                </div>
            </div>
        </div>
    )
}

export default EshopMain