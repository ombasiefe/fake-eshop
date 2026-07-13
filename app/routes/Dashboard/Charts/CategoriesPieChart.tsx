import React from 'react'
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

type Props = {
    data: {
        name: string,
        counts: number
    }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

function CategoriesPieChart({ data }: Props) {
    // Inject the fill color directly into the objects Recharts reads
    const chartData = data.map((item, index) => ({
        ...item,
        counts: Number(item.counts),
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
                    dataKey="counts"
                    nameKey="name"
                />
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default CategoriesPieChart