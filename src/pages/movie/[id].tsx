import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MovieDetail() {
    const router = useRouter();
    const { id } = router.query;

    const [movie, setMovie] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/movies/${id}`);
                const data = await res.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setMovie(data);
                    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                    setIsFavorite(favorites.some((fav: any) => fav.imdbID === data.imdbID));
                }
            } catch (err) {
                setError("Error fetching movie details.");
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    const addFavorite = () => {
        if (!movie) return;
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (!favorites.some((fav: any) => fav.imdbID === movie.imdbID)) {
            favorites.push(movie);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            setIsFavorite(true);
        }
    };

    if (loading) {
        return <p className="p-4">Loading...</p>;
    }

    if (error || !movie) {
        return <p className="p-4 text-red-500">{error || "Movie not found."}</p>;
    }

    return (
        <main className="p-4 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
            {movie.Poster !== "N/A" && (
                <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="mb-4 w-full max-w-md"
                />
            )}
            <p className="mb-2">
                <strong>Year:</strong> {movie.Year}
            </p>
            <p className="mb-2">
                <strong>Plot:</strong> {movie.Plot}
            </p>
            <p className="mb-2">
                <strong>Actors:</strong> {movie.Actors}
            </p>
            <div className="mb-2">
                <strong>Ratings:</strong>
                <ul className="list-disc ml-5">
                    {movie.Ratings && movie.Ratings.map((rating: any, index: number) => (
                        <li key={index}>
                            {rating.Source}: {rating.Value}
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={addFavorite}
                disabled={isFavorite}
                className="bg-green-500 text-white p-2 mt-4"
            >
                {isFavorite ? "Favorited" : "Add to Favorites"}
            </button>
        </main>
    );
}
