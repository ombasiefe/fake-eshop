import React from 'react'
import type { Route } from './+types/ProductDetails'
import { prisma } from '~/lib/db.server'
import { FaShoppingBasket } from 'react-icons/fa'
import ProductError from '../errors/Eshop_Errors/ProductError'
import { data, useRouteError } from 'react-router'

type Props = {}
export async function loader({ params }: Route.LoaderArgs) {
    const prod_Id = Number(params.id);

    try {
        const product_details = await prisma.products.findFirst({
            where: { id: prod_Id, isActive: true }
        })
        if (!product_details) {
            throw data('product not found with this id', { status: 404 })
        }
        // //console.log
        (product_details)
        return { product_details }

    } catch (e) {
        if (e instanceof Response) {
            throw e;
        }
        console.error("Error caused by: ", e)
        throw data("Database error", {
            status: 500,
        });
    }
}


export default function ProductDetails({ loaderData }: Route.ComponentProps) {
    const prod_infos = loaderData
    return (
        <div className='text-center flex'>
            <img src={prod_infos.product_details?.image} alt={prod_infos.product_details?.title} />
            <div className='flex flex-col items-center justify-between h-fit gap-10 '>
                <h2 className='text-2xl'>{prod_infos.product_details?.title}</h2>
                <p>{prod_infos.product_details?.description}</p>
                <div className='flex items-center '>
                    <span className='text-2xl'>{prod_infos.product_details?.price.toFixed(2)}€</span>

                </div>
            </div>

        </div>
    )
}

export function ErrorBoundary() {
    const error = useRouteError();
    return <ProductError error={error} />
}

