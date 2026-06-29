import React from 'react'
import type { Route } from './+types/ProductDetails'
import { prisma } from '~/db.server'
import { FaShoppingBasket } from 'react-icons/fa'

type Props = {}
export async function loader({ params }: Route.LoaderArgs) {
    const prod_Id = Number(params.id);

    try {
        const product_details = await prisma.products.findFirst({
            where: { id: prod_Id, isActive: true }
        })
        console.log(product_details)
        return { product_details }

    } catch (e) {
        console.error("could not get the product details", e)
        return { product_details: null }
    }
}

function ProductDetails({ loaderData }: Route.ComponentProps) {
    const prod_infos = loaderData
    return (
        <div className='text-center flex'>
            <img src={prod_infos.product_details?.image} alt={prod_infos.product_details?.title} />
            <div className='flex flex-col items-center justify-between h-fit gap-10 '>
                <h2 className='text-2xl'>{prod_infos.product_details?.title}</h2>
                <p>{prod_infos.product_details?.description}</p>
                <div className='flex items-center '>
                    <span className='text-xl'>{prod_infos.product_details?.price.toFixed(2)}€</span>
                    <button type='submit'
                        className=' border p-1.5 rounded-xl bg-black hover:bg-white hover:text-black cursor-pointer mx-4'>
                        <div className='flex '>
                            <FaShoppingBasket className='text-xl' />
                            <span className='mx-1'>Add to cart</span>
                        </div>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ProductDetails