import React, { useState } from 'react'
import type { Route } from './+types/EditProducts';
import { Form, redirect, useLoaderData } from 'react-router'
import { prisma } from '~/db.server'
import { HiOutlineSave } from 'react-icons/hi';
import path from 'path';
import fs from "fs/promises"
import { ManuelProductStrategy } from '~/services/products/manual-product';

type Props = {}
export async function loader({ params }: Route.LoaderArgs) {
    const product_id = Number(params.id)
    console.log(product_id);

    try {
        const Db_categories = await prisma.categories.findMany();
        const product_details = await prisma.products.findUnique({
            where: { id: product_id },
            include: { category: true }
        })
        if (!product_details) {
            console.error("Error fetching the product details from db")
        }
        return { product_details, Db_categories }
    } catch (e) {
        console.error(e);
        return { product_details: null }
    }
}
export async function action({ params, request }: Route.ActionArgs) {
    const service = new ManuelProductStrategy();
    const prod_Id = Number(params.id)
    const formData = await request.formData();
    const new_title = formData.get("title") as string;

    const new_price = Number(formData.get('price'));
    const new_visibility = formData.get('visibility') == "on" ? true : false as boolean;
    const new_description = formData.get('description') as string
    const new_category = Number(formData.get('category'))
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
        categoryId: new_category
    }
    console.log(data)
    try {
        service.edit(data.id, {
            name: data.title,
            description: data.description,
            price: data.price,
            image: data.image,
            categoryId: data.categoryId,
            isActive: data.isActive
        })
        return redirect("/admin/products");
    } catch (e) {
        console.error('An error occured while editing product:', e)
        throw new Response('Product editing error !')
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
        <div className="max-w-3xl mx-auto my-8 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
            {/* Header */}
            <div className="border-b border-gray-100 dark:border-gray-700 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Edit Product
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Modify the information below to update this product on your online storefront.
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
                        defaultValue={product_info.product_details?.title}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                        required
                    />
                </div>

                {/* Images Preview Section */}
                <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Current Image */}
                        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Current Product Image
                            </h4>
                            <div className="h-36 w-36 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
                                {product_info.product_details?.image ? (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={product_info.product_details?.image}
                                        alt={product_info.product_details?.title}
                                    />
                                ) : (
                                    <span className="text-xs text-gray-400">No image uploaded</span>
                                )}
                            </div>
                        </div>

                        {/* New Image Preview */}
                        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                New Preview
                            </h4>
                            <div className="h-36 w-36 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900">
                                {image ? (
                                    <img
                                        className="h-full w-full object-cover"
                                        src={image}
                                        alt="New preview"
                                    />
                                ) : (
                                    <div className="text-center p-2 text-xs text-gray-400 dark:text-gray-500">
                                        No new image selected
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Image File Input */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Upload New Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handle_image}
                            className="block w-full text-sm text-gray-900 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-white"
                        />
                    </div>
                </div>

                {/* Pricing and Category Settings */}
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
                            defaultValue={product_info.product_details?.price.toFixed(2)}
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
                            name="category"
                            defaultValue={product_info.product_details?.categoryId}
                            className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                        >
                            {product_info.Db_categories?.map((cat) => (
                                <option
                                    key={cat.id}
                                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                        defaultValue={product_info.product_details?.description}
                        className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition duration-150"
                    />
                </div>

                {/* Active Status Checkbox */}
                <div className="flex items-center p-1">
                    <input
                        id="visibility-checkbox"
                        type="checkbox"
                        name="visibility"
                        defaultChecked={product_info.product_details?.isActive}
                        className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                    <label
                        htmlFor="visibility-checkbox"
                        className="ml-2.5 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer select-none"
                    >
                        Mark as Active (visible on store front)
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-150 transform active:scale-95 shadow-sm"
                    >
                        <HiOutlineSave className="w-5 h-5" />
                        <span>Save Changes</span>
                    </button>
                </div>
            </Form>
        </div>
    )
}

export default EditProducts