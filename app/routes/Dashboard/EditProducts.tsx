import React, { useState } from 'react'
import type { Route } from './+types/EditProducts';
import { Form, redirect, useLoaderData } from 'react-router'
import { prisma } from '~/db.server'
import { HiOutlineSave } from 'react-icons/hi';
import path from 'path';
import fs from "fs/promises"

type Props = {}
export async function loader({ params }: Route.LoaderArgs) {
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
export async function action({ params, request }: Route.ActionArgs) {
    const prod_Id = Number(params.id)
    const formData = await request.formData();
    const new_title = formData.get("title") as string;

    const new_price = Number(formData.get('price'));
    const new_visibility = formData.get('visibility') == "on" ? true : false as boolean;
    const new_description = formData.get('description') as string
    const new_category = formData.get('category') as string
    console.log(new_visibility)

    const new_image = formData.get('image') as File;
    console.log("new image is", new_image)
    const current_product = await prisma.products.findUnique({
        where: { id: prod_Id }
    })

    let db_Images_path = current_product?.image ?? '/uploads/default-placeholder.png';
    console.log('new image size: ', new_image.size)

    if (new_image && new_image.size > 0) {
        const file_extension = path.extname(new_image.name) || ".jpg";
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${file_extension}`

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const physicalFilePath = path.join(uploadDir, uniqueFileName);

        const arrayBuffer = await new_image.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(physicalFilePath, buffer);

        db_Images_path = `/uploads/${uniqueFileName}`
        console.log(db_Images_path)
    }

    const data = {
        id: prod_Id,
        title: new_title,
        image: db_Images_path,
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
function EditProducts({ loaderData }: Route.ComponentProps) {
    const [image, setImage] = useState("");

    const product_info = loaderData;
    const handle_image = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log('file is:', file)
        if (!file) {
            return
        }
        const url = URL.createObjectURL(file);
        setImage(url)
    }
    console.log("product ifos:", product_info)
    return (
        <div>
            <h1>Edit Product</h1>
            <Form method='post' reloadDocument encType='multipart/form-data' >
                <div className='flex flex-col items-center w-full justify-around gap-4 '  >
                    <label > Product Title:
                        <input defaultValue={product_info.product_details?.title}
                            className='mx-2 border p-1 rounded-md' name='title'
                        />
                    </label>
                    <div className='flex justify-between gap-8 '>
                        <div>
                            <h4 className='text-center'>Current Product image</h4>
                            <img className='w-70' src={product_info.product_details?.image} alt={product_info.product_details?.title} />
                        </div>
                        <div>
                            <h4>New product image (Preview)</h4>
                            <img className='w-70' src={image} />
                        </div>
                    </div>
                    <label >Image:
                        <input type='file'
                            className='mx-2 w-max border p-1 rounded-md'
                            name='image'
                            accept='image/*'
                            onChange={handle_image} />
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
                        <label > is Active:
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