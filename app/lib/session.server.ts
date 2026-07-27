import bcrypt from "bcryptjs";
import { request } from "http";
import path from "path";
import { createCookieSessionStorage, data, redirect } from "react-router";
import { addNewUser, DoesUserExist } from "./db.server";
type SessionData = {
    userId: string;
}

type SessionFlashData = {
    error: string;
}

type User = {
    id: number;
    password: string;
    isAdmin: boolean;
}

const { getSession, commitSession, destroySession } = createCookieSessionStorage<SessionData, SessionFlashData>(
    {
        cookie: {
            name: "__session",
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secrets: [process.env.Secret || "s3cret1"],
            secure: true
        },
    },
);

export async function getUserId(request: Request): Promise<number | null> {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const userId = session.get("userId");
    if (!userId) {
        return null
    }
    return Number(userId);
}
export async function adminLogout(request: Request) {
    const session = await getSession(
        request.headers.get("Cookie"),
    );
    if (session) {
        return redirect("/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    } else {
        return redirect('/logout')
    }
}
export async function UserLogin(request: Request, password: string, email: string) {
    const Db_user = await DoesUserExist(email);
    //console.log("Db_user:", Db_user)
    if (!Db_user) {
        return { error: "invalid credentials" }
    }
    const result = await bcrypt.compare(password, Db_user.password)
    //console.log(result)
    if (!result) {
        return { message: "Invalid credentials" }

    }
    const session = await getSession(request.headers.get("Cookie"));
    // console.log(session)
    session.set("userId", String(Db_user.id))
    const redirectTo = Db_user.isAdmin ? "/admin" : "/products"
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await commitSession(session)
        }
    })
}
export async function UserRegister(new_email: string, new_password: string) {
    const existingUser = await DoesUserExist(new_email);
    if (existingUser) {
        return { error: "A user with this email already exists." };

    }
    await addNewUser(new_email, new_password)
    return { message: "Registration completed Successfully !" }
}
export { getSession, commitSession, destroySession };