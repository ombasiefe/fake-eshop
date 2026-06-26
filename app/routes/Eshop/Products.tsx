import { error } from 'console'
import React from 'react'
import { redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { prisma } from "~/db.server"
import { Form } from 'react-router'
import { FaShoppingBasket } from 'react-icons/fa'
import { BsArrowDownRightCircle } from 'react-icons/bs'
type Props = {}

export async function loader({ request }: LoaderFunctionArgs) {
    try {
        const products = await prisma.products.findMany({
            where: { isActive: true }
        });
        console.log(products)
        if (products.length === 0) {
            console.error("No products Found")
        }
        return { products }
    } catch (e) {
        return { error: "Error while adding products" }
        console.error("Error caused by: ", error)
    }
}
export async function action({ request }: ActionFunctionArgs) {
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

function Products({ }: Props) {
    const userPrducts = useLoaderData<typeof loader>();
    return (
        <div className='flex flex-col items-center justify-around'>
            <div className='flex justify-around flex-wrap gap-4 '>
                {userPrducts.products?.map((prod) => (
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

        </div >

    )
}

export default Products