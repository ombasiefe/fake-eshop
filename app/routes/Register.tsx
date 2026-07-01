import React from 'react'
import { Form, redirect } from 'react-router'
import type { Route } from "./+types/Register"
import { prisma } from '~/db.server'
import bcrypt from "bcryptjs";
type Props = {}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const new_email = formData.get('email') as string;
    const new_password = formData.get('password') as string;
    if (!new_email || !new_password) {
        return { error: "No email or password found" };
    }


    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: new_email }
        })
        if (existingUser) {
            return { error: "A user with this email already exists." };

        }
        const hashedPassword = await bcrypt.hash(new_password, 10)
        const new_User = await prisma.user.create({
            data: {
                email: new_email,
                password: hashedPassword
            }
        })

        return { message: "Registration completed successfully !" }

    } catch (error) {
        console.error("Error while registering a new user occured:", error)
        return { error: "User can not be Registered !" }
    }

}
function Register({ actionData }: Route.ComponentProps) {

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
                    Register
                </h3>
                <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
                    Create account
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

                    <div className="flex items-center justify-center mt-4">
                        <div>
                            {actionData?.error ? (
                                <p>{actionData.error}</p>
                            ) :
                                (
                                    <p>{actionData?.message}</p>
                                )}
                        </div>
                        <button
                            type='submit'
                            className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                            Sign In
                        </button>
                    </div>
                </Form>
            </div >
            <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-200">
                    You have got alreadey account ?{" "}
                </span>
                <a
                    href="/login"
                    className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
                >
                    Login
                </a>
            </div>
        </div >

    )
}

export default Register