SELECT
  cast(`fake_eshop_db`.`orders`.`createdAt` AS date) AS `date`,
  count(DISTINCT `fake_eshop_db`.`orders`.`id`) AS `orders`,
  sum(`fake_eshop_db`.`orderitem`.`price`) AS `total_income`
FROM
  (
    `fake_eshop_db`.`orders`
    JOIN `fake_eshop_db`.`orderitem` ON(
      `fake_eshop_db`.`orderitem`.`orderId` = `fake_eshop_db`.`orders`.`id`
    )
  )
GROUP BY
  cast(`fake_eshop_db`.`orders`.`createdAt` AS date)