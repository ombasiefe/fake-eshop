import React, { useState } from 'react'
import type { Route } from './+types/Products';

import { Form, redirect, useFetcher, } from 'react-router'
import { prisma } from "~/db.server";

type Props = {}


export async function loader({ request }: Route.LoaderArgs) {
    try {
        const Db_products = await prisma.products.findMany();
        if (Db_products.length == 0) {
            console.log("No products in DB");
        }
        return { products: Db_products || [] };
    } catch (e) {
        return { products: [] }
    }
}


export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get("action");
    if (!actionType) {
        console.log("unknown action type");
    }
    console.log(actionType)
    switch (actionType) {
        case "get_products_from_API":
            try {
                const response = await fetch("https://fakestoreapi.com/products");
                if (!response.ok) {
                    throw new Response("Error fetching API", { status: response.status })
                }
                const apiProducts = await response.json();
                //console.log(apiProducts);
                const transformedData = apiProducts.map((item: any) => ({
                    title: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: item.category
                }))
                // console.log("transfromed Data:", transformedData)

                const result = await prisma.products.createMany({
                    data: transformedData,
                    skipDuplicates: true,
                })

                console.log("Products inserted successfully")
            } catch (e) {
                console.error("Product insert failed:", e)
            }
            break
        case "edit_this_prod":
            try {
                const product_id = Number(formData.get('prodId'))
                if (!product_id) return { error: "Product id not found " }
                console.log("product_id", product_id)
                return redirect(`${product_id}`)
            } catch (e) {
                console.error("An error occur while trying to reach the edit product component", e)
            } break
        case "delete_this_product":
            try {
                const productId = Number(formData.get('prod_Id'));
                if (!productId) return { error: "Product id not found " }
                console.log(productId)

                await prisma.products.delete({
                    where: { id: productId }

                })

            } catch (e) {
                console.error("An occur while trying to delete a product", e)

            }
            break
    }

}



const Products = ({ actionData, loaderData }: Route.ComponentProps) => {

    const products = loaderData;
    const fetcher = useFetcher();
    console.log("Products from db:", products)
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null)
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
            <div className="flex items-center gap-x-4 justify-between">
                <h2 className="text-lg font-medium text-gray-800 dark:text-white">
                    Products
                </h2>
                <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
                    {products.products.length} Products
                </span>
                <fetcher.Form method='post'>
                    <button className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        type='submit' name='action' value="get_products_from_API">
                        <svg
                            className="w-5 h-5 mx-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="mx-1">Get Products from API</span>
                    </button>

                </fetcher.Form>

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
                                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            <button className="flex items-center gap-x-2">
                                                <span>Status</span>

                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            <button className="flex items-center gap-x-2">
                                                <span>ID</span>

                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Description                                        </th>
                                        <th
                                            scope="col"
                                            className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                        >
                                            Category
                                        </th>
                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                    {products.products.length == 0 ? (
                                        <p>No products found</p>
                                    ) : products.products.map((prod) => (
                                        <tr key={prod.id}>
                                            <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-x-3">

                                                    <div className="flex items-center gap-x-2">
                                                        <img
                                                            className="object-contain w-10 h-10 rounded-full"
                                                            src={prod.image}
                                                            alt={prod.title}
                                                        />
                                                        <div>
                                                            <h2 className="font-medium text-gray-800 dark:text-white ">
                                                                {prod.title.split("").slice(0, 20)}...
                                                            </h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {prod.isActive ? (
                                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                                                        <h2 className="text-sm font-normal text-emerald-500">
                                                            Active
                                                        </h2>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-emerald-100/60 dark:bg-gray-800">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-700" />

                                                        <h2 className="text-sm font-normal text-red-700">
                                                            Not Active
                                                        </h2>
                                                    </div>)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {prod.id}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                                {prod.description.split("").slice(0, 40)}...
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-2">
                                                    <p className="px-3 py-1 text-xs text-indigo-500 rounded-full dark:bg-gray-800 bg-indigo-100/60">
                                                        {prod.category}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-x-6">
                                                    <fetcher.Form method='post'>
                                                        <input type="hidden" name='action' value="edit_this_prod" />
                                                        <button className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                                            type='submit' name='prodId' value={prod.id}>
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
                                                                setSelectedId(prod.id);
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

export default Products