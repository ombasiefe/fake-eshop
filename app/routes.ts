import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
    layout("routes/Eshop/EshopMain.tsx", [
        //Navbar Links
        route("/", "routes/Eshop/EshopHome.tsx"),
        route("*", "routes/NotFound.tsx"),
        route("/products", "routes/Eshop/Products.tsx"),
        route("/about", "routes/Eshop/About.tsx"),
        route("/contact", "routes/Eshop/Contact.tsx"),
        route("/login", "routes/Login.tsx"),
        //-------------------------------------------------------
        route("/products/:id", "routes/Eshop/ProductDetails.tsx"),
        route("/register", "routes/Register.tsx"),
        route("/order-form", "routes/Eshop/OrderForm.tsx"),
        route("/user-profile", "routes/Eshop/UserProfile.tsx"),
        route("/user/logout", "routes/Eshop/Logout.tsx"),
        route("/user/orders", "routes/Eshop/UserOrders.tsx"),
    ]),
    layout("routes/Dashboard/AdminDashboard.tsx", [
        route("admin", "routes/Dashboard/Home.tsx"),
        route("admin/products", "routes/Dashboard/Products.tsx"),
        route("admin/products/categories", "routes/Dashboard/Categories.tsx"),
        route('admin/logout', "routes/Dashboard/Logout.tsx"),

        route("admin/products/add_product", "routes/Dashboard/AddProducts.tsx"),
        route("admin/products/:id", "routes/Dashboard/EditProducts.tsx"),
        route("admin/orders", "routes/Dashboard/Orders.tsx"),
        route("admin/notifications", "routes/Dashboard/Notifications.tsx")
    ])

] satisfies RouteConfig;
