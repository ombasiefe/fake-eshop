import React, { useState } from 'react'
import type { Route } from './+types/AddProducts';
import { Form, redirect } from 'react-router'
import { prisma } from '~/lib/db.server'
import { HiOutlineSave } from 'react-icons/hi';
import path from 'path';
import fs from "fs/promises"
import { ManuelProductStrategy } from '~/lib/products/manual-product';
type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
    try {
        const Db_categories = await prisma.categories.findMany();
        return Db_categories
    } catch (e) {
        console.error("Error occured while trying to reach the categories", e);
    }
}

export async function action({ params, request }: Route.ActionArgs) {
    const service = new ManuelProductStrategy()
    const formData = await request.formData();
    const new_title = formData.get("title") as string;
    const new_price = Number(formData.get('price'));
    const new_visibility = formData.get('visibility') == "on" ? true : false as boolean;
    const new_description = formData.get('description') as string
    const new_category = Number(formData.get('category'))
    //Image extraction as file 
    const new_image = formData.get('image') as File;
    let dbImagePath = '/uploads/default-placeholder.png'

    if (new_image && new_image.size > 0) {
        //console.log
        (new_image.size)
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
        //console.log
        (dbImagePath)

    }


    ////console.log(new_visibility)
    const data = {
        title: new_title,
        image: dbImagePath,
        price: new_price,
        isActive: new_visibility,
        description: new_description,
        categoryId: new_category
    }
    //console.log(data)
    try {
        service.add({ name: data.title, description: data.description, price: data.price, image: data.image, categoryId: data.categoryId, isActive: data.isActive })
        return redirect("/admin/products");
    } catch (e) {
        console.error("FULL ERROR:", e);
        throw e;
    }

}
function AddProduct({ loaderData }: Route.ComponentProps) {
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
    const categories = loaderData

    return (
        <div className="max-w-2xl mx-auto my-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            {/* Header */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Product
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Fill in the details below to publish a new product to your catalog.
                </p>
            </div>

            <Form method="post" reloadDocument encType="multipart/form-data" className="space-y-6">

                {/* Product Title */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Product Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g. Wireless Noise-Cancelling Headphones"
                        className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                        required
                    />
                </div>

                {/* Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                    {/* Image Preview */}
                    <div className="flex justify-center md:col-span-1">
                        {image ? (
                            <img
                                className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                                src={image}
                                alt="Product preview"
                            />
                        ) : (
                            <div className="h-32 w-32 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-xs text-gray-400 dark:text-gray-500 text-center p-2">
                                No Preview Available
                            </div>
                        )}
                    </div>

                    {/* File Input */}
                    <div className="md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Product Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-white"
                        />
                    </div>
                </div>

                {/* Grid Container for Price, Category & Visibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Price */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            name="price"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Category
                        </label>
                        <select
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                            name="category"
                            defaultValue=""
                            required
                        >
                            <option value="" disabled>Select category</option>
                            {categories?.map((cat) => (
                                <option
                                    key={cat.id}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                                    value={cat.id}
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Product Description */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Product Description
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Write a detailed description of the product highlights..."
                        className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                    />
                </div>

                {/* Visibility Checkbox Toggle */}
                <div className="flex items-center p-1">
                    <input
                        id="visibility-checkbox"
                        type="checkbox"
                        name="visibility"
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <label
                        htmlFor="visibility-checkbox"
                        className="ml-2.5 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer select-none"
                    >
                        Visible on online storefront
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-150 transform active:scale-95 shadow-sm"
                    >
                        <HiOutlineSave className="w-5 h-5" />
                        <span>Add Product</span>
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default AddProduct