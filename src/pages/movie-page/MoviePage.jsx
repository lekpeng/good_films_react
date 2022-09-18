import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./MoviePage.scss";
import movieApis from "../../utils/movie";
import reviewApis from "../../utils/review";
import MovieReview from "./MovieReview";

function MoviePage() {
  const params = useParams();
  const token = "Bearer " + localStorage.getItem("user_token");
  const tokenExists = localStorage.getItem("user_token");
  const [movieInViewApiId, setMovieInViewApiId] = useState(params.movieApiId);
  const [movie, setMovie] = useState({});
  const [existingReview, setExistingReview] = useState({});
  const [reviewDate, setReviewDate] = useState([]);

  useEffect(() => {
    setMovieInViewApiId(params.movieApiId);
  }, [params.movieApiId]);

  useEffect(() => {
    const fetchMovie = async () => {
      const movieResult = await movieApis.getMovie(movieInViewApiId);
      const ourMovieResult = await movieApis.getOurMovie(movieInViewApiId);
      console.log("our movie result", ourMovieResult);
      let averageRating = "No votes yet!";
      let reviewIdsWithRating = [];

      if (Object.keys(ourMovieResult.data).length) {
        averageRating = ourMovieResult.data.averageRating;
        if (averageRating === 0) {
          averageRating = "No votes yet!";
        }
        reviewIdsWithRating = ourMovieResult.data.reviewIds.filter((review) => review.rating > 0);
      }

      setMovie({
        ...movieResult.data,
        averageRatingGF: averageRating,
        numRatings: reviewIdsWithRating.length,
      });
    };

    const fetchExistingReview = async () => {
      const reviewResults = await reviewApis.getReviewFromMovieAndUser(params.movieApiId, token);
      setExistingReview(reviewResults.data);
      setReviewDate([reviewResults.data.updatedAt.slice(0, 10)]);
    };

    fetchMovie();
    fetchExistingReview();
  }, [movieInViewApiId]);

  const {
    id,
    name,
    title,
    poster_path,
    popularity,
    release_date,
    runtime,
    overview,
    vote_average,
    vote_count,
    averageRatingGF,
    numRatings,
  } = movie;

  console.log("Movie:", movie);
  console.log("Review:", existingReview);
  console.log("Date:", reviewDate);

  return (
    <div className="movie">
      <Container>
        <h1>{name ? name : title}</h1>
        <Row>
          <Col md={3}>
            <img src={`https://image.tmdb.org/t/p/original${poster_path}`}></img>
          </Col>
          <Col md={9}>
            <p>Overview: {overview}</p>
            <p>Release Date: {release_date}</p>
            <p>Duration: {runtime}</p>
            <p>TMD Average Vote Score: {vote_average}</p>
            <p>TMD No. of Votes: {vote_count}</p>
            <p>Good Films Average Vote Score: {averageRatingGF}</p>
            <p>Good Films No. of Votes: {numRatings}</p>

            <div>
              {existingReview === null ? (
                <MovieReview token={token} tokenExists={tokenExists} />
              ) : (
                <p>
                  You reviewed this movie on {reviewDate}. Click here to see your{" "}
                  <Link to={`/reviews/${existingReview._id}`}>review</Link>.{" "}
                </p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default MoviePage;
