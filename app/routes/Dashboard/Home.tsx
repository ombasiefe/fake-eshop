import React from 'react'
import type { Route } from './+types/Home'
import { getSession } from '~/lib/session.server'
import { redirect } from 'react-router'
import OrdersLineChart from './Charts/OrdersLineChart'
import { getCategoriesChartData, getOrderStatusChartData, getRawChartData } from '~/lib/db.server'
import Categories from './Categories'
import CategoriesPieChart from './Charts/CategoriesPieChart'
import { Card } from 'flowbite-react'
import { HiOutlineCube, HiOutlineFolder, HiOutlineShoppingCart } from 'react-icons/hi'
import OrderStatusChart from './Charts/OrderStatusChart'
type Props = {}
export async function loader({ request }: Route.LoaderArgs) {
    const session = await getSession(request.headers.get("Cookie"))
    const userId = session.get("userId")
    if (!userId) {
        return redirect('/login');
    }
    try {
        const rawChartdata = (await getRawChartData()).data
        const ordersChartData = rawChartdata.map(item => {
            const dateObj = item.date ? new Date(item.date) : new Date(0);
            return {
                date: dateObj.toLocaleDateString('en-GB'),
                orders: Number(item.orders),
                total_income: item.total_income ?? 0
            }

        });
        const categoriesChartData = (await getCategoriesChartData()).data;
        const productsByCategory = categoriesChartData.map(prod_cat => ({
            name: prod_cat.name,
            counts: Number(prod_cat.count)
        }))
        const orderStatusChart = (await getOrderStatusChartData()).data;
        const orderStatusChartData = orderStatusChart.map(order_stat => ({
            Status: String(order_stat.Status),
            count: Number(order_stat.count)
        }))
        return {
            ordersChartData,
            productsByCategory,
            orderStatusChartData
        }
    } catch (e) {
        console.error("Error while fetching data for order chart", e)
        return {
            ordersChartData: [],
            productsByCategory: [] as { name: string; counts: number }[],
            orderStatusChartData: []
        }
    }
}

function Home({ loaderData }: Route.ComponentProps) {
    const LineChartData = loaderData.ordersChartData
    const ChartData = loaderData.productsByCategory
    const totalOrdersCount = LineChartData.reduce((acc, curr) => acc + curr.orders, 0);
    const orderStatusData = loaderData.orderStatusChartData

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen rounded-md">
            {/* Header section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                    Dashboard Overview
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Track sales velocity, inventory status, and category breakdowns.
                </p>
            </div>

            {/* Metric Summary Grid using Flowbite Cards */}
            <div className="grid grid-cols-1 gap-5 mb-6 sm:grid-cols-2 lg:grid-cols-3">

                {/* Products Card */}
                <Card href="/admin/products" className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                            <HiOutlineCube className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</h5>
                            <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Active Catalog
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Orders Card */}
                <Card href="/admin/orders" className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900 text-green-600 dark:text-green-200">
                            <HiOutlineShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Recorded Orders</h5>
                            <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {totalOrdersCount} <span className="text-xs font-normal text-gray-500">({LineChartData.length} entries)</span>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Categories Card */}
                <Card href="/admin/products/categories" className="hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900 text-purple-600 dark:text-purple-200">
                            <HiOutlineFolder className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Categories</h5>
                            <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {ChartData.length} Segments
                            </p>
                        </div>
                    </div>
                </Card>

            </div>

            {/* Split Visualization Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Line Chart Component Wrapper */}
                <Card className="lg:col-span-3">
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Sales Timeline</h3>
                        <p className="text-xs text-gray-500">Order trends analyzed chronologically</p>
                    </div>
                    <div className="w-full overflow-hidden">
                        <OrdersLineChart data={LineChartData} />
                    </div>
                </Card>

                {/* Pie Chart Component Wrapper */}

                <Card className='lg:col-span-2'>
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Order Staus</h3>
                        <p className="text-xs text-gray-500">Orders grouped per status</p>
                    </div>
                    <div className="w-full min-h-[300px] justify-center items-center">
                        <OrderStatusChart data={orderStatusData} />
                    </div>
                </Card>
                <Card >
                    <div className="mb-4">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Category Proportions</h3>
                        <p className="text-xs text-gray-500">Volume share grouped per product category</p>
                    </div>
                    <div className="w-full flex justify-center items-center min-h-[300px]">
                        <CategoriesPieChart data={ChartData} />
                    </div>
                </Card>

            </div>
        </div>
    )
}

export default Home