import React, { useState } from 'react'
import type { Route } from './+types/AddProducts';
import { Form, redirect } from 'react-router'
import { prisma } from '~/db.server'
import { HiOutlineSave } from 'react-icons/hi';
import path from 'path';
import fs from "fs/promises"
type Props = {}

export async function action({ params, request }: Route.ActionArgs) {
    const formData = await request.formData();
    const new_title = formData.get("title") as string;
    const new_price = Number(formData.get('price'));
    const new_visibility = formData.get('visibility') == "on" ? true : false as boolean;
    const new_description = formData.get('description') as string
    const new_category = formData.get('category') as string
    //Image extraction as file 
    const new_image = formData.get('image') as File;
    let dbImagePath = '/uploads/default-placeholder.png'

    if (new_image && new_image.size > 0) {
        console.log(new_image.size)
        const fileExtension = path.extname(new_image.name) || ".jpg"
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${fileExtension}`;

        //Defining where the image will be stored
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        const physicalFilePath = path.join(uploadDir, uniqueFileName)

        //Reading the file in a node buffer stream and writing it to the disk
        const arrayBuffer = await new_image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer)
        await fs.writeFile(physicalFilePath, buffer)

        //getting the relative URL path that will be stored in DB 
        dbImagePath = `/uploads/${uniqueFileName}`;
        console.log(dbImagePath)

    }


    //console.log(new_visibility)
    const data = {
        title: new_title,
        image: dbImagePath,
        price: new_price,
        isActive: new_visibility,
        description: new_description,
        category: new_category
    }
    console.log(data)
    try {
        console.log("Before upsert");

        await prisma.products.createMany({
            data: data,
            skipDuplicates: true
        });

        console.log("After upsert");
        console.log("Redirecting..")
        return redirect("/admin/products");
    } catch (e) {
        console.error("FULL ERROR:", e);
        throw e;
    }

}
function AddProduct({ }: Props) {
    const [image, setImage] = useState("")
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const localURL = URL.createObjectURL(file);
            setImage(localURL)
        } else {
            setImage("")
        }

    }

    return (
        <div>
            <h1>Add Product</h1>
            <Form method='post' reloadDocument encType="multipart/form-data">
                <div className='flex flex-col items-center w-full justify-around '  >


                    <label > Product Title:
                        <input
                            className='mx-2 border p-1 rounded-md' name='title'
                        />
                    </label>
                    <img className='w-70' src={image} />
                    <div className='flex justify-between gap-2'>
                        <label >Image :
                            <input type='file'
                                className='mx-2 w-max border p-1 rounded-md'
                                name='image'
                                onChange={handleImageChange}
                                accept='image/*' />

                        </label>
                    </div>
                    <div>

                        <label > Price:
                            <input
                                type='number'
                                name='price'
                                step='0.01'

                                className='w-full mt-1 border p-2 rounded-md text-white'
                                required
                            />
                        </label>
                        <label > Visibility:
                            <input type="checkbox" className='mx-2'

                                name='visibility'

                            />
                        </label>
                    </div>
                    <label > Product Description:
                        <textarea className='w-full mt-1 border p-1 rounded-md'
                            name='description'

                        >
                        </textarea>
                    </label>
                    <label > Category:
                        <input type="text"
                            className='mx-2 p-1 border rounded-md' name='category' />
                    </label>
                    <button className="flex items-center px-4 mt-2 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        type='submit' >
                        <HiOutlineSave />
                        <span className="mx-1">Add Product</span>
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default AddProduct