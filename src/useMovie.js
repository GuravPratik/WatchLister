import { useState, useEffect } from "react";

export function useMovie(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function fetchMovie() {
      try {
        setIsLoading(true);
        setIsError("");
        const res = await fetch(
          `http://www.omdbapi.com/?s=${query}&apikey=ef6190b0`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error("Something went wrong!!!");
        }

        const data = await res.json();
        if (data.Response === "False") {
          throw new Error("Movie not found");
        }
        setMovies(data.Search);
        setIsError("");
      } catch (e) {
        if (e.name !== "AbortError") {
          setIsError(e.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setIsError("");
      setMovies([]);
      return;
    }
    // handleClose();
    fetchMovie();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, isError };
}
