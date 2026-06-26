# Fake Eshop! 🛍️

A website that has two views for two user types: visitor and admin. The visitor's side is like an eshop with product cards and product details. The admin's side has a dashboard with products and the admin has the ability of editing the products.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)
## Tech Stack:
- Node.js
- 📡React-router
- 🎨TailwindCss
- 🔒TypeScript
- React-icons
- Prisma ORM 
- 📊Mysql Database [XAMPP](https://www.apachefriends.org/download.html)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

# Requirements:
Make sure that you have already installed Node.js and Xampp. If you don't download from links below:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* Mysql Database [XAMPP](https://www.apachefriends.org/download.html)

# Step 1: Clone and install dependencies
 1) Open your terminal in VS Code inside your project root directory (`app\fake-eshop`).

### Installation

2) Install the dependencies:

```bash
npm install 
```

## Step 2: Database configuration 
1) Create a file named .env in your root folder if it doesn't exist yet.
2) Add your MySQL connection string. Replace root, your password and fake_eshop_db with your actual database credentials. 

```bash
DATABASE_URL="mysql://root:your_password@localhost:3306/fake_eshop_db"
```
Your .env file should look like:
```bash
DATABASE_URL="mysql://root@localhost:3306/fake_eshop_db"
DATABASE_USER="root" | your Database_username
DATABASE_PASSWORD="" | your Database_password 
DATABASE_HOST="localhost" |your host but in our case it will be localhost
DATABASE_NAME="fake_eshop_db" |your Database_name
DATABASE_PORT="3306" |your Port number, default is 3306
``` 

## Step 3: Run prisma Schema Migrations
```bash
npx prisma db push
```

```bash
npx prisma generate
```
## Step 4: Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
