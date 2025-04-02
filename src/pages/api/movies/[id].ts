import type { NextApiRequest, NextApiResponse } from "next";

const detailCache: { [key: string]: any } = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Missing or invalid movie id." });
    }

    if (detailCache[id]) {
        return res.status(200).json(detailCache[id]);
    }

    try {
        const response = await fetch(
            `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${encodeURIComponent(id)}&plot=full`
        );
        const data = await response.json();

        if (data.Response === "False") {
            return res.status(400).json({ error: data.Error });
        }

        detailCache[id] = data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching movie details." });
    }
}
