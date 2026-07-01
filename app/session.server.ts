import path from "path";
import { createCookieSessionStorage } from "react-router";
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
export { getSession, commitSession, destroySession };