import React from 'react'
import type { Route } from "./+types/Login"
import { Form, redirect } from 'react-router'
import { useActionData } from 'react-router'
import { prisma } from '~/db.server'
import bcrypt from 'bcryptjs'
type Props = {}

import { getSession, commitSession, } from '~/session.server';

export async function loader({ request, }: Route.LoaderArgs) {
    const session = await getSession(
        request.headers.get("Cookie"),
    )
    if (session.has("userId")) {
        return redirect("/login");
    }

}


export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }
    try {
        const Db_user = await prisma.user.findUnique({
            where: { email },
        })
        if (!Db_user) {
            return { error: 'Invalid Credentials' }
        }
        const result = await bcrypt.compare(password, Db_user.password)
        if (!result) {
            return { error: "Invalid " }
        } else {
            const session = await getSession(request.headers.get("Cookie"));
            session.set("userId", String(Db_user.id))
            return redirect("/admin", {
                headers: {
                    "Set-Cookie": await commitSession(session)
                }
            });
        }

    } catch (error) {
        return { error: "Invalid credentials" }
    }

}

function Login({ actionData }: Route.ComponentProps) {
    const info = actionData
    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="px-6 py-4">
                <div className="flex justify-center mx-auto">
                    <img
                        className="w-auto h-7 sm:h-8"
                        src="https://merakiui.com/images/logo.svg"
                        alt=""
                    />
                </div>
                <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
                    Welcome Back
                </h3>
                <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
                    Login or create account
                </p>
                <Form method='post'>
                    <div className="w-full mt-4">
                        <input
                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            type="email"
                            name='email'
                            placeholder="Email Address"
                            aria-label="Email Address"
                            required
                        />
                    </div>
                    <div className="w-full mt-4">
                        <input
                            className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            type="password"
                            name='password'
                            placeholder="Password"
                            aria-label="Password"
                            required
                        />
                    </div>
                    <div> {info?.error && (
                        <p>{info.error}</p>
                    )}
                    </div>
                    <div className="flex items-center justify-center mt-4">

                        <button
                            type='submit'
                            className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                            Log In
                        </button>
                    </div>
                </Form>
            </div>
            <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-200">
                    Don't have an account?{" "}
                </span>
                <a
                    href="/register"
                    className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
                >
                    Register
                </a>
            </div>
        </div>

    )
}

export default Login