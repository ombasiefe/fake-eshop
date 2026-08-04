import React from 'react'
import { data, redirect } from "react-router";

type Props = {}

export function loader() {
    throw data("Not Found", { status: 404 });
}
function NotFound({ }: Props) {
    return (
        <div><h1>404- Page Not Found</h1></div>
    )
}

export default NotFound