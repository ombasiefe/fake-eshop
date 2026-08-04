import { isRouteErrorResponse } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
    error: unknown;
};

export default function DashboardError({ error }: Props) {
    let title = "Dashboard Error";
    let message = "Something went wrong loading this section.";
    let status: number | null = null;

    if (isRouteErrorResponse(error)) {
        status = error.status;
        const responseData = typeof error.data === "string" ? error.data : error.data?.message;

        if (error.status === 404) {
            title = "Resource Not Found";
            message = responseData || "The requested item could not be found.";
        } else if (error.status === 500) {
            title = "Server Error";
            message = responseData || "There was a problem communicating with the server.";
        }
    } else if (error instanceof Error) {
        title = "Unexpected Error";
        message = error.message;
    }

    return (
        <div className="flex min-h-[300px] items-center justify-center p-6">
            <div className="w-full max-w-md rounded-xl border border-red-300 bg-white p-6 shadow-md dark:bg-gray-900">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900">
                        <FaExclamationTriangle className="text-2xl text-red-600 dark:text-red-300" />
                    </div>

                    {status && (
                        <span className="mb-2 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900 dark:text-red-200">
                            Error {status}
                        </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}