import React from 'react'
import type { Route } from './+types/Home'
import { getSession } from '~/session.server'
import { redirect } from 'react-router'
type Props = {}
export async function loader({ request }: Route.LoaderArgs) {
    const sesion = await getSession(request.headers.get("Cookie"))
    const userId = sesion.get("userId")
    if (!userId) {
        return redirect('/login');
    }

}

function Home({ }: Props) {
    return (
        <div>Home</div>
    )
}

export default Home