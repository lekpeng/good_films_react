import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";
import LikesAndCommentsCounter from "./LikesAndCommentsCounter";
import movieApis from "../../utils/movie";
import profileApis from "../../utils/profile";
import StarRating from "../movie-page/StarRating";
import { CircularProgress } from "@mui/material";

// import CommentThread from "./CommentThread";
import CommentBox from "./CommentBox";
import apis from "../../utils/review";
import jwt_decode from "jwt-decode";
import Collapse from "react-bootstrap/Collapse";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import datetimeToRelativeTime from "../../utils/datetime/relativeCalendar";
import styles from "./ReviewCard.scss";
import { CardHeader } from "@mui/material";
import Image from "react-bootstrap/Image";

function ReviewCard({ reviewId, page }) {
  const token = "Bearer " + localStorage.getItem("user_token");
  const navigate = useNavigate();
  const currentUserUsername = jwt_decode(token).data.username;
  const [review, setReview] = useState({});
  const [movie, setMovie] = useState({});
  // const [userHairLength, setUserHairLength] = useState(null);
  const [areButtonsVisible, setAreButtonsVisible] = useState(false);
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchReview = async () => {
      const reviewResult = await apis.getReview(reviewId, token);
      setReview(reviewResult.data);
    };

    fetchReview();
  }, []);

  useEffect(() => {
    const fetchMovie = async () => {
      if (review.movieId) {
        try {
          const movieResult = await movieApis.getMovie(review.movieId.movieApiId);

          setMovie(movieResult.data);
        } catch (err) {
          console.log("error with fetching movie details", err);
        }
      }
    };

    // const fetchUserGender = async () => {
    //   try {
    //     const response = await profileApis.getGender(review.authorUserId.username);

    //     setUserHairLength(response.data.gender === "female" ? "longHair" : "shortHair");
    //   } catch (err) {
    //     setUserHairLength("shortHair");
    //   }
    // };
    if (review.authorUserId && page === "review-page") {
      if (review.authorUserId.username === currentUserUsername) {
        setAreButtonsVisible(true);
      }
    }
    fetchMovie();
    // fetchUserGender();
  }, [review]);

  const deleteReviewBackend = async () => {
    await apis.deleteReview(reviewId, token);
    navigate(`/profiles/${currentUserUsername}`);
  };

  // if (!review.authorUserId) {
  //   console.log("loading");
  //   return <>Loading...</>;
  // }

  const navToEditReview = () => {
    navigate(`/reviews/${params.reviewId}/edit`);
  };

  return (
    <div className="review-card">
      <Card className="my-5">
        <Card.Header>
          <Row className="header">
            <Col md="auto pe-1">
              <img
                className="review-card-avatar"
                src={`https://avatars.dicebear.com/api/avataaars/${
                  review.authorUserId && review.authorUserId.username
                }.svg?size=60&radius=50`}></img>

              {/* {userHairLength ? (
                <img
                  className="review-card-avatar"
                  src={`https://avatars.dicebear.com/api/avataaars/${
                    review.authorUserId && review.authorUserId.username
                  }.svg?top=${userHairLength}&facialHairChance=0&size=60&radius=50`}></img>
              ) : (
                <></>
              )} */}
            </Col>
            <Col md="auto" className="align-self-center ps-0">
              <LinkContainer
                to={`/profiles/${review.authorUserId && review.authorUserId.username}`}>
                <Card.Link className="review-card-username">
                  {review.authorUserId && review.authorUserId.username}
                </Card.Link>
              </LinkContainer>
              {" reviewed "}
              <LinkContainer to={`/movies/${review.movieId && review.movieId.movieApiId}`}>
                {page === "movie-page" ? (
                  <></>
                ) : (
                  <Card.Link className="review-card-movie-title m-0">{review.movieTitle}</Card.Link>
                )}
              </LinkContainer>
            </Col>
            <Col className="align-self-center">
              {review.createdAt ? (
                <Card.Text className="text-end">
                  {datetimeToRelativeTime(review.createdAt)}
                </Card.Text>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {review.rating ? (
            <>
              <StarRating rateScore={review.rating} component="review-card"></StarRating>
            </>
          ) : (
            <></>
          )}
          {review.reviewText ? (
            <Card.Text className="text-start mt-3">{review.reviewText}</Card.Text>
          ) : (
            <></>
          )}

          {page === "movie-page" ? (
            <></>
          ) : !movie.backdrop_path ? (
            <div>wait ah still loading</div>
          ) : (
            <div className="movie text-center mb-3">
              <Image
                className="img-thumbnail"
                width="80%"
                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}></Image>
            </div>
          )}

          <LikesAndCommentsCounter review={review} />
          <LikeButton
            review={review}
            setReview={setReview}
            currentUserUsername={currentUserUsername}
          />
          <Card.Link
            style={{ cursor: "pointer" }}
            onClick={() => setOpenCommentBox(!openCommentBox)}>
            Comment
          </Card.Link>
          {page === "review-page" ? (
            <></>
          ) : (
            <LinkContainer to={"/reviews/" + review._id}>
              <Card.Link>See review</Card.Link>
            </LinkContainer>
          )}

          <Collapse in={openCommentBox}>
            <div>
              <CommentBox review={review} setReview={setReview} />
            </div>
          </Collapse>
        </Card.Body>
      </Card>
      {areButtonsVisible ? (
        <div className="review-buttons">
          <Button onClick={navToEditReview} className="me-3" variant="primary">
            Edit
          </Button>

          <Button onClick={deleteReviewBackend} variant="danger">
            Delete
          </Button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ReviewCard;
