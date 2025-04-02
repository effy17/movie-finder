import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const { data: movies = [], error, isFetching } = useQuery({
        queryKey: ["movies", searchTerm, page],
        queryFn: async () => {
            const res = await fetch(
                `/api/movies?query=${encodeURIComponent(searchTerm)}&page=${page}`
            );
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data.Search || [];
        },
        enabled: !!searchTerm,
        retry: false,
    });

    const handleSearch = () => {
        if (!inputValue) return;
        setSearchTerm(inputValue);
        setPage(1);
    };

    const handlePrevious = () => {
        setPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNext = () => {
        setPage((prev) => prev + 1);
    };

    return (
        <main className="p-4 grid gap-4">
            <h1 className="text-3xl font-bold text-center">Movie Explorer</h1>

            <div className="flex justify-center items-center gap-2">
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border p-2 w-64"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white p-2 w-24"
                >
                    Search
                </button>
            </div>

            {isFetching && <p className="text-center">Loading...</p>}
            {error && (
                <p className="text-center text-red-500">
                    {error instanceof Error ? error.message : "An error occurred"}
                </p>
            )}

            {searchTerm && (
                <>
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {movies.map((movie: any) => (
                                <Link
                                    key={movie.imdbID}
                                    href={`/movie/${movie.imdbID}`}
                                    className="border p-2 cursor-pointer flex flex-col items-center"
                                >
                                    {movie.Poster !== "N/A" ? (
                                        <img
                                            src={movie.Poster}
                                            alt={movie.Title}
                                            className="mb-2 w-full h-auto object-contain max-h-96"
                                        />
                                    ) : (
                                        <div className="bg-gray-300 h-48 mb-2 flex items-center justify-center w-full">
                                            No Image
                                        </div>
                                    )}
                                    <h2 className="font-semibold text-center px-2 break-words">
                                        {movie.Title}
                                    </h2>
                                    <p className="text-sm text-center">{movie.Year}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        !isFetching && (
                            <p className="text-center">No movies found on this page.</p>
                        )
                    )}

                    <div className="flex justify-between mt-4 w-full md:w-1/2 mx-auto">
                        <button
                            disabled={page === 1}
                            onClick={handlePrevious}
                            className="bg-gray-500 text-white p-2 w-24 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-gray-500 text-white p-2 w-24"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}
