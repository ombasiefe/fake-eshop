// errors/ProductError.tsx

import { isRouteErrorResponse } from "react-router";
import { FaExclamationTriangle } from "react-icons/fa";

type Props = {
    error: unknown;
};

export default function CategoryError({ error }: Props) {
    let title = "Something went wrong";
    let message = "We couldn't load the categories. Please try again later.";
    let status: number | null = null;

    if (isRouteErrorResponse(error)) {
        status = error.status;

        if (error.status === 404) {
            title = "Error not found";
            message = error.data;
        } else if (error.status === 500) {
            title = "Server error";
            message = "There was a problem communicating with the server.";
        }
    }

    if (error instanceof Error) {
        title = "Unexpected error Category";
        message = error.message;
    }

    return (
        <div className="flex min-h-[400px] items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl border border-red-300 bg-white p-6 shadow-lg dark:bg-gray-900">

                <div className="flex flex-col items-center text-center">

                    <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900">
                        <FaExclamationTriangle className="text-3xl text-red-600 dark:text-red-300" />
                    </div>

                    {status && (
                        <span className="mb-2 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700 dark:bg-red-900 dark:text-red-200">
                            Error {status}
                        </span>
                    )}

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {title}
                    </h2>

                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                        {message}
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 rounded-lg bg-black px-5 py-2 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                    >
                        Try Again
                    </button>

                </div>
            </div>
        </div>
    );
}