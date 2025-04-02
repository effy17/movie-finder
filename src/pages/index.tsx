import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
    Grid,
    Typography,
    Button,
    TextField,
    Paper,
    Box,
    Tooltip,
} from "@mui/material";

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
        <Paper sx={{ p: 4, m: 4 }}>
            <Grid container direction="column" spacing={3}>
                <Grid item>
                    <Typography variant="h3" align="center">
                        Movie Explorer
                    </Typography>
                </Grid>

                <Grid item container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Search movies..."
                            variant="outlined"
                            fullWidth
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                            Search
                        </Button>
                    </Grid>
                </Grid>

                {isFetching && (
                    <Grid item>
                        <Typography align="center">Loading...</Typography>
                    </Grid>
                )}
                {error != null && (
                    <Grid item>
                        <Typography align="center" color="error">
                            {error instanceof Error ? error.message : "An error occurred"}
                        </Typography>
                    </Grid>
                )}

                {searchTerm && (
                    <Grid item>
                        {movies.length > 0 ? (
                            <Grid container spacing={2}>
                                {movies.map((movie: any) => (
                                    <Grid item xs={6} md={3} key={movie.imdbID}>
                                        <Link href={`/movie/${movie.imdbID}`} passHref>
                                            <Paper
                                                elevation={2}
                                                sx={{
                                                    width: 220,
                                                    height: 400,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    mx: "auto",
                                                    p: 2,
                                                    textAlign: "center",
                                                }}
                                            >
                                                {movie.Poster !== "N/A" ? (
                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            height: 280,
                                                            overflow: "hidden",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <img
                                                            src={movie.Poster}
                                                            alt={movie.Title}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            width: "100%",
                                                            height: 280,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            bgcolor: "#f0f0f0",
                                                            mb: 1,
                                                        }}
                                                    >
                                                        <Typography variant="body2">No Image</Typography>
                                                    </Box>
                                                )}

                                                <Box sx={{ width: "100%", flexShrink: 0 }}>
                                                    <Tooltip title={movie.Title} arrow>
                                                        <Typography variant="h6" noWrap>
                                                            {movie.Title}
                                                        </Typography>
                                                    </Tooltip>
                                                    <Typography variant="body2">{movie.Year}</Typography>
                                                </Box>
                                            </Paper>
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            !isFetching && (
                                <Typography align="center">No movies found on this page.</Typography>
                            )
                        )}
                    </Grid>
                )}

                {searchTerm && (
                    <Grid item container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={6} sm={3}>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                disabled={page === 1}
                                onClick={handlePrevious}
                            >
                                Previous
                            </Button>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <Button variant="contained" color="secondary" fullWidth onClick={handleNext}>
                                Next
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
}



