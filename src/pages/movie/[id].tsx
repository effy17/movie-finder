import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Grid, Typography, Button, Paper } from "@mui/material";
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
        return (
            <Typography variant="body1" sx={{ p: 2 }}>
                Loading...
            </Typography>
        );
    }
    if (error || !movie) {
        return (
            <Typography variant="body1" color="error" sx={{ p: 2 }}>
                {error || "Movie not found."}
            </Typography>
        );
    }
    return (
        <Paper sx={{ p: 4, m: 4 }}>
            <Grid container direction="column" spacing={2} alignItems="flex-start">
                <Grid item>
                    <Typography variant="h3" align="left">
                        {movie.Title}
                    </Typography>
                </Grid>
                {movie.Poster !== "N/A" && (
                    <Grid item>
                        <img
                            src={movie.Poster}
                            alt={movie.Title}
                            style={{ width: "100%", maxWidth: 400, marginBottom: 16 }}
                        />
                    </Grid>
                )}
                <Grid item>
                    <Typography variant="body1" align="left">
                        <strong>Year:</strong> {movie.Year}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" align="left">
                        <strong>Plot:</strong> {movie.Plot}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" align="left">
                        <strong>Actors:</strong> {movie.Actors}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1" align="left">
                        <strong>Ratings:</strong>
                    </Typography>
                    <ul style={{ marginLeft: 24 }}>
                        {movie.Ratings?.map((rating: any, index: number) => (
                            <li key={index}>
                                <Typography variant="body2">
                                    {rating.Source}: {rating.Value}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={addFavorite}
                        disabled={isFavorite}
                    >
                        {isFavorite ? "Favorited" : "Add to Favorites"}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
}