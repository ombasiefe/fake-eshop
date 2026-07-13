import React from 'react'
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'


type Props = {
    data: {
        Status: string,
        count: number
    }[]
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function OrderStatusChart({ data }: Props) {
    const chartData = data.map((item, index) => ({
        ...item,
        count: Number(item.count),
        fill: COLORS[index % COLORS.length] // Recharts automatically looks for a "fill" key
    }));

    return (
        <ResponsiveContainer width="100%" height={300} >
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="Status"
                />
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default OrderStatusChart