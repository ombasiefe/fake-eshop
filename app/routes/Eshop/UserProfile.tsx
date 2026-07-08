import React, { useState } from 'react'
import { Popover, Button, Avatar } from 'flowbite-react'
import { redirect, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { getSession } from '~/session.server'
import { prisma } from "~/db.server"
import { Drawer, DrawerHeader, DrawerItems } from 'flowbite-react'
type Props = {}
export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const session = await getSession(request.headers.get('Cookie'));
        const userId = Number(session.get('userId'))
        if (!userId) {
            return redirect('/login');
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
function UserProfile() {
    return (
        <>

        </>
    );
}

export default UserProfile