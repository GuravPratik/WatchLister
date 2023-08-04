/* eslint-disable react/prop-types */
import { useState } from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import NumResult from "./components/NumResult";
import Container from "./components/Container";
import Box from "./components/Box";
import MovieList from "./components/MovieList";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import MovieDetails from "./components/MovieDetails";
import Loader from "./components/Loader";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, isError } = useMovie(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function onSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handleClose() {
    setSelectedId(null);
  }

  function onAddWatch(newMovie) {
    // const newWatchMovieList = [...watched, newMovie];
    // setWatched(newWatchMovieList);

    setWatched((prevWatch) => [...prevWatch, newMovie]);
  }

  function onRemoveMovie(movieId) {
    const newWatchMovieList = watched.filter(
      (movie) => movie.imdbID !== movieId
    );
    setWatched(newWatchMovieList);
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Container>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MovieList movies={movies} onSelectMovie={onSelectMovie} />
          )}
          {isError && <ErrorMessage message={isError} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              movieId={selectedId}
              handleClose={handleClose}
              onAddWatch={onAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveMovie={onRemoveMovie}
              />
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="loader">
      <span>⛔</span>
      {message}
    </p>
  );
}
