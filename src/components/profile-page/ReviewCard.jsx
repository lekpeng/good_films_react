import { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import LikeButton from "./LikeButton";
import CommentThread from "./CommentThread";
import CommentBox from "./CommentBox";
import apis from "../../utils/review";
import jwt_decode from "jwt-decode";
import Collapse from "react-bootstrap/Collapse";

function ReviewCard({ reviewId }) {
  const token = "Bearer " + localStorage.getItem("user_token");
  const currentUserUsername = jwt_decode(token).data.username;

  const [review, setReview] = useState({});
  const [openCommentBox, setOpenCommentBox] = useState(false);

  // if (reviewDetails) {
  //   console.log("reviewdetails", reviewDetails);
  // }
  useEffect(() => {
    const fetchReview = async () => {
      const reviewResult = await apis.getReview(reviewId, token);
      setReview(reviewResult.data);
    };

    fetchReview();
  }, []);

  return (
    <div className="review-card">
      <Card>
        <Card.Body>
          <Card.Title>{review.movieTitle}</Card.Title>
          <Card.Text>Review: {review.reviewText}</Card.Text>
          <Card.Text>Rating: {review.rating}</Card.Text>
          <LikeButton
            review={review}
            setReview={setReview}
            currentUserUsername={currentUserUsername}
          />
          <Card.Link onClick={() => setOpenCommentBox(!openCommentBox)}>Comment</Card.Link>
          <Card.Link>See review</Card.Link>
          <Collapse in={openCommentBox}>
            <div>
              <CommentBox review={review} setReview={setReview} />
            </div>
          </Collapse>
          <CommentThread review={review} />
        </Card.Body>
      </Card>
    </div>
  );
}

export default ReviewCard;
