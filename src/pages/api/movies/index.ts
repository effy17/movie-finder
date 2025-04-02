import type { NextApiRequest, NextApiResponse } from "next";

const searchCache: { [key: string]: any } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query, page = "1" } = req.query;

    if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Missing or invalid query parameter." });
    }

    const cacheKey = `search-${query}-page-${page}`;

    if (searchCache[cacheKey]) {
        return res.status(200).json(searchCache[cacheKey]);
    }

    try {
        const response = await fetch(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
        );
        const data = await response.json();

        if (data.Response === "False") {
            return res.status(400).json({ error: data.Error });
        }

        searchCache[cacheKey] = data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching from OMDb." });
    }
}
