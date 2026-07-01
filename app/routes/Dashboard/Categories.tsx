import React, { useState } from 'react'
import type { Route } from './+types/Categories'
import { prisma } from '~/db.server'
import { useFetcher } from 'react-router'
import { Form } from 'react-router'
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    try {
        const Db_categories = await prisma.categories.findMany()
        return { categories: Db_categories }
    } catch (e) {
        console.error(e)
        return { categories: [] }
    }
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const actionType = formData.get("action") as string
    console.log("actionType:", actionType)
    switch (actionType) {
        case "add_new_category":
            const new_categoryName = formData.get("new_category_name") as string;
            console.log("new Category name:", new_categoryName)
            if (!new_categoryName) {
                console.error("There is no new category name");
            }
            try {
                const result = await prisma.categories.create({
                    data: { name: new_categoryName }
                })
                console.log("New category inserted successfully !")

            } catch (e) {
                console.error("Could not find any category to insert")
            }
    }
}
function Categories({ loaderData }: Route.ComponentProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const { categories } = loaderData;
    const fetcher = useFetcher();
    const [categoryAdderOpen, setCategoryAdderOpen] = useState(false)

    return (
        <section className="container px-4 mx-auto">
            {confirmOpen && (
                <div className='fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center'>
                    <div className='bg-gray-200 p-6 rounded-lg w-[300px]'>
                        <h2 className='text-lg font-bold mb-4 text-black'>Confirm Delete</h2>

                        <p className='mb-6 text-black'>Are you sure to delete this Product ?</p>
                        <div className='flex justify-end gap-3'>
                            <button
                                onClick={() => setConfirmOpen(false)}
                                className='px-3 py-1 bg-gray-300 rounded'
                            >Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!selectedId) return
                                    fetcher.submit(
                                        {
                                            action: "delete_this_product",
                                            prod_Id: selectedId
                                        },
                                        { method: "post" })
                                    setConfirmOpen(false);
                                    setSelectedId(null)
                                }}
                                className="px-3 py-1 bg-red-600 text-white rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {categoryAdderOpen && (
                <div className="fixed inset-0 bg-transparent backdrop-blur-md flex items-center justify-center">
                    <div className='bg-gray-300 p-6 rounded-lg w-[300px]'>

                        <fetcher.Form method='post'>
                            <div className='text-black'>
                                <h2>Add new Category</h2>
                                <label htmlFor=""> Category name:
                                    <input type="hidden" name='action' value="add_new_category" />
                                    <input type="text" className='border rounded-md' name='new_category_name' />
                                </label>
                                <div className='flex justify-center gap-10 mt-1'>
                                    <button onClick={() => setCategoryAdderOpen(false)}
                                        className='p-1 rounded-md bg-red-600 text-white hover:cursor-pointer'>
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        className='p-1 rounded-md bg-blue-600 text-white hover:cursor-pointer'>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </fetcher.Form>
                    </div>
                </div>

            )}
            <div className="flex items-center gap-x-4 justify-between">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                    Categories
                </h2>

                <button
                    className='p-1 bg-blue-600 rounded-md hover:cursor-pointer'
                    onClick={() => {
                        setCategoryAdderOpen(true);
                    }}>
                    Add a category
                </button>

                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    {categories.length} Categories
                </span>


            </div>
            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            <div className="flex items-center gap-x-3">

                                                <span>Name</span>
                                            </div>
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            <button className="flex items-center gap-x-2">
                                                <span>ID</span>

                                            </button>
                                        </th>

                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {categories.length == 0 ? (
                                        <p>No categories found</p>
                                    ) : categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="px-4 py-4 text-sm font-medium text-white whitespace-nowrap">
                                                <h2>{cat.name}</h2>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {cat.id}
                                            </td>


                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-6">
                                                    <fetcher.Form method='post'>
                                                        <input type="hidden" name='action' value="edit_this_prod" />
                                                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                                            type='submit' name='prodId' value={cat.id}>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-5 h-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </fetcher.Form>
                                                    <fetcher.Form method='post' >


                                                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                                                            type="button"
                                                            onClick={() => {
                                                                console.log("delete clicked")
                                                                setSelectedId(cat.id);
                                                                setConfirmOpen(true);
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-5 h-5"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </fetcher.Form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </section >
    )
}

export default Categories