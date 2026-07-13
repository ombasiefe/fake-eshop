SELECT
  `fake_eshop_db`.`orders`.`Status` AS `Status`,
  count(`fake_eshop_db`.`orders`.`id`) AS `count`
FROM
  `fake_eshop_db`.`orders`
GROUP BY
  `fake_eshop_db`.`orders`.`Status`