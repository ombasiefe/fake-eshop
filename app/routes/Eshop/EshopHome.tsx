import { error } from 'console'
import type { Route } from './+types/EshopHome';

import React from 'react'
import { data, redirect } from 'react-router'
import { prisma } from "~/db.server"

import { Button, Card, Carousel } from 'flowbite-react';

type Props = {}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const products = await prisma.products.findMany({
      where: { isActive: true },
      take: 5
    });
    //console.log(products)
    if (products.length === 0) {
      console.error("No products Found")
    }
    return { products }
  } catch (e) {
    return { error: "Error while adding products" }
    console.error("Error caused by: ", error)
  }
}
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const actionType = formData.get('action') as string;
  const prodId = formData.get('prodId');
  switch (actionType) {
    case "see_details":
      try {
        //console.log("product:", prodId)
        return redirect(`/products/${prodId}`)
      } catch (e) {
        console.error("Could not redirect to product details page:", e)
      }
  }
}

function EshopHome({ loaderData }: Route.ComponentProps) {
  const userPrducts = loaderData;


  return (

    <div className='flex flex-col items-center justify-around gap-4' >
      <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden rounded-md">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/carousel_images/Store_image.png"
            alt="Car Market Dealership"
            className="object-cover w-full h-full"
          />
          {/* This overlay ensures text is readable on top of the image */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            The Complete Modern Lifestyle.
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Upgrade your wardrobe, your gadgets, and your everyday aesthetic with products crafted for the conscious, modern individual.          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" href='/products'
              style={{ backgroundColor: "#AD9471" }}>Explore Our Collection</Button>
            <Button size="xl" color="light" href='#'>Invest to our vision</Button>
          </div>
        </div>
      </section>





      <div className='flex justify-around flex-wrap gap-4 '>

        {userPrducts.products?.map((prod) => (
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

            </div>
          </Card>
        ))
        }

      </div>
      <div className='text-center bg-[#AD9471] p-2 w-80 rounded-xl mt-4 cursor-pointer ' onClick={() => window.location.href = '/products'}>
        <button >View All Products</button>
      </div>
    </div >

  )
}

export default EshopHome