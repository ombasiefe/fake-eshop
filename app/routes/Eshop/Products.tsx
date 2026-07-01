import { error } from 'console'
import React from 'react'
import type { Route } from './+types/Products'
import { redirect } from 'react-router'
import { prisma } from "~/db.server"
import { Form } from 'react-router'
import { FaShoppingBasket } from 'react-icons/fa'
import { BsArrowDownRightCircle } from 'react-icons/bs'
import { Link } from 'react-router'
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    const pageSize = 9;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1
    const tot_products = await prisma.products.count()
    const tot_pages = Math.max(1, Math.ceil(tot_products / pageSize));
    try {
        const Db_products = await prisma.products.findMany({
            where: { isActive: true },
            skip: (page - 1) * pageSize,
            take: pageSize
        });
        console.log(Db_products)
        if (Db_products.length === 0) {
            console.error("No products Found")
        }
        return { products: Db_products, page, tot_pages }
    } catch (e) {
        console.error("Error caused by: ", error)
        return { products: [], page: 1, tot_pages: 1 }
    }
}
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const actionType = formData.get('action') as string;
    const prodId = formData.get('prodId');
    switch (actionType) {
        case "see_details":
            try {
                console.log("product:", prodId)
                return redirect(`/products/${prodId}`)
            } catch (e) {
                console.error("Could not redirect to product details page:", e)
            }
    }
}

function Products({ loaderData }: Route.ComponentProps) {
    const { products, tot_pages, page } = loaderData;
    return (
        <div className='flex flex-col items-center justify-around'>
            <div className='flex justify-around flex-wrap gap-4 '>
                {products?.map((prod) => (
                    <div key={prod.id} className='w-80 flex flex-col border p-2 items-center justify-around rounded-lg hover:rotate-1 '>
                        <h2 className='text-cente text-xl'>{prod.title}</h2>
                        <img src={prod.image} alt={prod.title} className='w-24' />
                        <p>{prod.description}</p>
                        <div className='flex items-center justify-between'>
                            <span className='text-2xl'>{prod.price.toFixed(2)}€</span>
                            <div className='flex '>
                                <button type='submit'
                                    className='mx-4 border p-1.5 rounded-xl bg-black hover:bg-white hover:text-black cursor-pointer'>
                                    <div className='flex '>

                                        <FaShoppingBasket className='text-xl' />
                                        <span className='mx-1'>Add to cart</span>

                                    </div>
                                </button>
                                <Form method='post'>
                                    <input type="hidden" name='action' value="see_details" />
                                    <button type='submit' name='prodId' value={prod.id} className='cursor-pointer'>
                                        <BsArrowDownRightCircle className='text-2xl ' /></button>
                                </Form>
                            </div>

                        </div>
                    </div>
                ))
                }

            </div>
            <div className='flex justify-center mt-2  gap-5 '>
                <Link to={`?page=${page - 1}`}
                    className='p-2 border rounded-md '
                > Previous</Link>
                {Array.from({ length: tot_pages }, (_, index) => (
                    <Link key={index}
                        to={`?page=${index + 1}`}
                        className='p-2 border rounded-md '>{index + 1}</Link>
                ))}
                <Link to={`?page=${page + 1}`}
                    className='p-2 border rounded-md '>Next</Link>
            </div>
        </div >

    )
}

export default Products