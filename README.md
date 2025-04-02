# Movie Explorer

Movie Explorer is a Next.js application that allows users to search for movies using the OMDb API. The app features a responsive search page with pagination, detailed movie pages with favorite functionality, and leverages React Query for efficient data fetching and caching. Material UI is used for the layout and styling.

## Features

- **Movie Search:** Search movies by title using the OMDb API.
- **Pagination:** Navigate through search results with Previous/Next controls.
- **Movie Details:** View detailed information including title, poster, year, plot, actors, and ratings.
- **Favorites:** Add movies to a favorites list stored in local storage.
- **Data Fetching & Caching:** Uses [@tanstack/react-query](https://tanstack.com/query/latest) for data fetching and caching.
- **Responsive Design:** Built with Material UI’s Grid system for a responsive, accessible interface.

## Technologies Used

- **Next.js:** React framework for server-side rendering and routing.
- **React:** UI library for building interactive interfaces,using 19.0.0.
- **@tanstack/react-query:** For data fetching, caching, and server state synchronization.
- **Material UI:** Component library for building a responsive UI.  (This project includes a MUI version on the `movieFinder_mui` branch.)
- **Tailwind CSS:** A utility-first CSS framework that lets you rapidly build custom, responsive user interfaces using low-level utility classes. It provides a highly customizable and consistent design system without writing a lot of custom CSS.
- **OMDb API:** Provides movie data (requires a valid API key).
- **Local Storage:** For storing favorite movies.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/effy17/movie-finder.git
   cd movie-finder

To setup run the following:
```bash

npm install
# or
yarn install

```
Create .env.local file in the root directory and add your OMDb API key:
```bash

OMDB_API_KEY=your_api_key_here

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
