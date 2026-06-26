import React, { useState } from 'react'
import { Form, redirect, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { prisma } from '~/db.server'
import { HiOutlineSave } from 'react-icons/hi';

type Props = {}
export async function loader({ params }: LoaderFunctionArgs) {
    const product_id = Number(params.id)
    console.log(product_id);

    try {
        const product_details = await prisma.products.findUnique({
            where: { id: product_id }
        })
        if (!product_details) {
            console.error("Error fetching the product details from db")
        }
        return { product_details }
    } catch (e) {
        console.error(e);
        return { product_details: null }
    }
}
export async function action({ params, request }: ActionFunctionArgs) {
    const prod_Id = Number(params.id)
    const formData = await request.formData();
    const new_title = formData.get("title") as string;
    const new_image = formData.get('image') as string;
    const new_price = Number(formData.get('price'));
    const new_visibility = formData.get('visibility') == "on" ? true : false as boolean;
    const new_description = formData.get('description') as string
    const new_category = formData.get('category') as string
    console.log(new_visibility)
    const data = {
        id: prod_Id,
        title: new_title,
        image: new_image,
        price: new_price,
        isActive: new_visibility,
        description: new_description,
        category: new_category
    }
    console.log(data)
    try {
        console.log("Before upsert");

        await prisma.products.upsert({
            where: { id: prod_Id },
            update: data,
            create: data
        });

        console.log("After upsert");
        console.log("Redirecting..")
        return redirect("/admin/products");
    } catch (e) {
        console.error("FULL ERROR:", e);
        throw e;
    }

}
function EditProducts({ }: Props) {

    const product_info = useLoaderData<typeof loader>();


    console.log("product ifos:", product_info)
    return (
        <div>
            <h1>Edit Product</h1>
            <Form method='post' reloadDocument >
                <div className='flex flex-col items-center w-full justify-around '  >
                    <label > Product Title:
                        <input defaultValue={product_info.product_details?.title}
                            className='mx-2 border p-1 rounded-md' name='title'
                        />
                    </label>
                    <img className='w-70' src={product_info.product_details?.image} alt={product_info.product_details?.title} />

                    <label >Image URL:
                        <input type='url' defaultValue={product_info.product_details?.image}
                            className='mx-2 w-max border p-1 rounded-md' name='image' />
                    </label>
                    <div>

                        <label > Price:
                            <input
                                type='number'
                                name='price'
                                step='0.01'
                                defaultValue={product_info.product_details?.price.toFixed(2)}
                                className='w-full mt-1 border p-2 rounded-md text-white'
                                required
                            />
                        </label>
                        <label > Visibility:
                            <input type="checkbox" className='mx-2'
                                defaultChecked={product_info.product_details?.isActive}
                                name='visibility'

                            />
                        </label>
                    </div>
                    <label > Product Description:
                        <textarea className='w-full mt-1 border p-1 rounded-md'
                            name='description'
                            defaultValue={product_info.product_details?.description}
                        >
                        </textarea>
                    </label>
                    <label > Category:
                        <input type="text" defaultValue={product_info.product_details?.category}
                            className='mx-2 p-1 border rounded-md' name='category' />
                    </label>
                    <button className="flex items-center px-4 mt-2 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        type='submit' >
                        <HiOutlineSave />
                        <span className="mx-1">Save Changes</span>
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default EditProducts