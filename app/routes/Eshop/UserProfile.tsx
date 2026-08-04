import React, { useState } from 'react'
import { Popover, Button, Avatar } from 'flowbite-react'
import { redirect, useLoaderData, type LoaderFunctionArgs } from 'react-router'
import { getUserId } from '~/lib/session.server'
import { findUser, prisma } from "~/lib/db.server"
import { Drawer, DrawerHeader, DrawerItems } from 'flowbite-react'
type Props = {}
export async function loader({ request }: LoaderFunctionArgs) {
    try {

        const userId = await getUserId(request)
        if (!userId) {
            return redirect('/login');
        }

        const user = await findUser(userId)
        if (!user) {
            console.error("user not found !")
        }

        return { user: user }
    } catch (e) {
        console.error("An error occured while loading user Profile page:", e)
    }
}
function UserProfile() {
    return (
        <>
        </>
    );
}

export default UserProfile