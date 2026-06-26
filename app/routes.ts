import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/Eshop/EshopMain.tsx", [
        route("/", "routes/Eshop/home.tsx"),
        route("/products", "routes/Eshop/Products.tsx"),
        route("/products/:id", "routes/Eshop/ProductDetails.tsx")
    ]),
    layout("routes/Dashboard/AdminDashboard.tsx", [
        route("admin", "routes/Dashboard/Home.tsx"),
        route("admin/products", "routes/Dashboard/Products.tsx"),
        route("admin/products/:id", "routes/Dashboard/EditProducts.tsx")
    ])

] satisfies RouteConfig;
