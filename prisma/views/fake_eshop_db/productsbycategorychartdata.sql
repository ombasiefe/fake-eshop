SELECT
  `fake_eshop_db`.`categories`.`name` AS `name`,
  count(`fake_eshop_db`.`products`.`id`) AS `count`
FROM
  (
    `fake_eshop_db`.`categories`
    JOIN `fake_eshop_db`.`products` ON(
      `fake_eshop_db`.`products`.`categoryId` = `fake_eshop_db`.`categories`.`id`
    )
  )
GROUP BY
  `fake_eshop_db`.`categories`.`name`