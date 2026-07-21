import { error } from 'console'
import React, { useEffect, useState } from 'react'
import type { Route } from './+types/Products'
import { isRouteErrorResponse, redirect, useRouteError, useSearchParams } from 'react-router'
import { prisma } from "~/db.server"
import { Form } from 'react-router'
import { FaShoppingBasket } from 'react-icons/fa'
import { BsArrowDownRightCircle } from 'react-icons/bs'
import { Link } from 'react-router'
import { useFetcher } from 'react-router'
import { Card } from 'flowbite-react'

import Cart from './Cart'
import ProductError from '../errors/Eshop_Errors/ProductError'
type Props = {}
type CartItem = {
    productId: number;
    productTitle: string;
    productImage: string;
    productPrice: number;
    quantity: number;
};
export async function loader({ request }: Route.LoaderArgs) {
    const pageSize = 6;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1
    try {
        const tot_products = await prisma.products.count({
            where: {
                isActive: true
            }
        })
        const tot_pages = Math.max(1, Math.ceil(tot_products / pageSize));
        ////console.log
        (tot_pages)

        const Db_products = await prisma.products.findMany({
            where: { isActive: true },
            skip: (page - 1) * pageSize,
            take: pageSize
        });
        ////console.log
        (Db_products)
        if (Db_products.length === 0) {
            //console.error("No products Found")
            throw new Response("Products not found", {
                status: 404,
            })
        }

        return { products: Db_products, page, tot_pages }
    } catch (e) {
        if (e instanceof Response) {
            throw e;
        }
        console.error("Error caused by: ", error)
        throw new Response("Database error", {
            status: 500,
        });
    }
}
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('action') as string;
    const prodId = formData.get('prodId');
    switch (actionType) {
        case "see_details":
            try {
                // //console.log
                ("product:", prodId)
                return redirect(`/products/${prodId}`)

            } catch (e) {
                console.error("Could not redirect to product details page:", e)
                throw new Response('Could not redirect to details page')
            }
            break;


    }
}

export default function Products({ loaderData }: Route.ComponentProps) {
    const { products, tot_pages, page } = loaderData;
    function addToCart(prodId: number, prodName: string, prodImage: string, prodPrice: number) {

        const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
        const existinItem = cart.find(
            item => item.productId === prodId
        )
        if (!existinItem) {
            cart.push({
                productImage: prodImage,
                productId: prodId,
                productTitle: prodName,
                productPrice: prodPrice,
                quantity: 1,
            })
                ////console.log
                (cart)
            localStorage.setItem("cart", JSON.stringify(cart))
            window.dispatchEvent(new Event("cartUpdated"))
        }

    }
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success") === "true";
    useEffect(() => {
        if (!success) return

        localStorage.removeItem("cart");
        searchParams.delete("success")
        setSearchParams(searchParams)

    }, [success])
    return (
        <>
            <div className='flex flex-col  justify-around'>
                <div className='flex justify-around flex-wrap gap-4 '>
                    {products?.map((prod) => (
                        <Card
                            className="max-w-sm"
                            imgAlt={prod?.title}
                            imgSrc={prod?.image}
                            key={prod?.id}
                        >
                            <a href={`/products/${prod?.id}`}>
                                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                    {prod?.title}
                                </h5>
                            </a>
                            <div className="mb-5 mt-2.5 flex items-center">
                                <svg
                                    className="h-5 w-5 text-yellow-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                    className="h-5 w-5 text-yellow-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                    className="h-5 w-5 text-yellow-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                    className="h-5 w-5 text-yellow-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <svg
                                    className="h-5 w-5 text-yellow-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="ml-3 mr-2 rounded bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-200 dark:text-cyan-800">
                                    5.0
                                </span>
                            </div>
                            <div className="flex items-center justify-between" >
                                <span className="text-3xl font-bold text-gray-900 dark:text-white">{prod?.price.toFixed(2)}€</span>
                                <div onClick={() => {
                                    addToCart(prod?.id, prod?.title, prod?.image, prod?.price)
                                    setIsCartOpen(true)
                                }}>
                                    <a
                                        href="#"
                                        className="rounded-lg bg-[#A48866] px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4"
                                    >
                                        Add to cart
                                    </a>
                                </div>
                            </div>
                        </Card>
                    ))
                    }

                </div>
                <div className='flex justify-center mt-2  gap-5 '>
                    {page > 1 ? (
                        <Link to={`?page=${page - 1}`}
                            className='p-2 border rounded-md '
                        > Previous</Link>
                    ) : (<span> </span>)}

                    {Array.from({ length: tot_pages }, (_, index) => (
                        <Link key={index}
                            to={`?page=${index + 1}`}
                            className='p-2 border rounded-md '>{index + 1}</Link>
                    ))}
                    {page < tot_pages ? (
                        <Link to={`?page=${page + 1}`}
                            className='p-2 border rounded-md '>Next</Link>
                    ) : (<span></span>)}
                </div>

            </div >
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();

    return <ProductError error={error} />;
}
