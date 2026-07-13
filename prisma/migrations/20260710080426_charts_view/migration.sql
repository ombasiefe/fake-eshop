/*
  Warnings:

  - The values [declined] on the enum `Orders_Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
CREATE VIEW OrdersChartData AS
SELECT 
    DATE(orders.createdAt) AS date,
    COUNT(DISTINCT orders.id) AS orders,
    SUM(orderitem.price) AS total_income
FROM orders
JOIN orderitem
    ON orderitem.orderId = orders.id
GROUP BY DATE(orders.createdAt);

CREATE VIEW ProductsByCategoryChartData AS 
SELECT 
    categories.name, 
    COUNT(products.id) AS count
FROM 
    categories
JOIN 
    products ON products.categoryId = categories.id
GROUP BY 
    categories.name;

CREATE VIEW OrderStatusChart AS
SELECT Status, 
COUNT(id) AS count
FROM 
    orders
    GROUP BY
    Status;