import { useEffect, useState } from "react";
import StarRating from "./StarRating.jsx";
import Loader from "./Loader.jsx";
/* eslint-disable react/prop-types */
function MovieDetails({ movieId, handleClose, onAddWatch, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const isWatch = watched.map((movie) => movie.imdbID).includes(movieId);

  const userWatchMovieRating = watched.find(
    (movie) => movie.imdbID === movieId
  )?.userRating;

  function handleOnAddMovie() {
    const newWatchMovie = {
      imdbID: movieId,
      title,
      year,
      poster,
      userRating,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
    };
    onAddWatch(newWatchMovie);
    handleClose();
  }

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${movieId}&apikey=ef6190b0`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovieDetails();
  }, [movieId]);

  useEffect(
    function () {
      if (!title) return;

      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatch ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    setStarRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleOnAddMovie}>
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You have already rated this movie with {userWatchMovieRating}
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed By {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieDetails;
