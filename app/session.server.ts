import path from "path";
import { createCookieSessionStorage, redirect } from "react-router";
type SessionData = {
    userId: string;
}

type SessionFlashData = {
    error: string;
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
    if (!userId) return null;
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
export { getSession, commitSession, destroySession };