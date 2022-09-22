import React, { useEffect, useState } from "react";
import apis from "../../utils/profile";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ReviewCard from "../profile-page/ReviewCard";
import ErrorPage from "../../components/error-page/ErrorPage";
import jwt_decode from "jwt-decode";
import { CircularProgress } from "@mui/material";
import styles from "./UserFeedPage.scss";

function UserFeedPage() {
  const [userStatus, setUserStatus] = useState("old");
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [userFeedReviewIds, setUserFeedReviewIds] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  const token = "Bearer " + localStorage.getItem("user_token");
  const currentUserUsername = jwt_decode(token).data.username;

  useEffect(() => {
    const fetchCurrentUserProfile = async (username) => {
      try {
        const profileResult = await apis.getProfile(username, token);
        setUserFeedReviewIds(profileResult.data.reviews);
        setCurrentUserProfile(profileResult.data);
      } catch (err) {
        console.log("some error getting current user profile", err);

        setErrorMsg(err.response.data.error);
      }
    };

    fetchCurrentUserProfile(currentUserUsername);
  }, []);

  useEffect(() => {
    const fetchFolloweeReviewIds = async () => {
      const followeeReviewIds = await Promise.all(
        currentUserProfile.followees.map(async (followee) => {
          try {
            const profileResult = await apis.getProfile(followee, token);
            return profileResult.data.reviews;
          } catch (err) {
            console.log("some error getting followees profile", err);
            toast.error(err.response.data.error);
          }
        })
      );
      setUserFeedReviewIds([...userFeedReviewIds, ...followeeReviewIds].flat());
    };

    if (Object.keys(currentUserProfile).length) {
      console.log("currentUserProfile.reviews.length", currentUserProfile.reviews.length);
      if (currentUserProfile.followees.length) {
        fetchFolloweeReviewIds();
      } else if (!currentUserProfile.reviews.length) {
        console.log("setting new user status");
        setUserStatus("new");
      }
    }
  }, [currentUserProfile]);

  if (errorMsg) {
    return <ErrorPage message={errorMsg} />;
  }

  return (
    <div className="user-feed-page">
      <Container className="container-restrict-width">
        {userStatus === "new" ? (
          <div>
            <h1>Welcome!</h1>
            <p>
              This is your reviews feed, where reviews by yourself and people you follow will be
              posted! To begin, head over to "Browse" or use the search bar to start penning a
              review!
            </p>
            <p>
              You may also go to "Profile" by using the dropdown at the top right hand corner to
              find friends see what films they've been watching!
            </p>
          </div>
        ) : (
          <></>
        )}
        <div className="reviews">
          {!userFeedReviewIds ? (
            <CircularProgress />
          ) : (
            userFeedReviewIds &&
            userFeedReviewIds
              .sort((reviewA, reviewB) => {
                return new Date(reviewB.createdAt) - new Date(reviewA.createdAt);
              })
              .map((review) => (
                <ReviewCard key={review._id} reviewId={review._id} page={"user-feed-page"} />
              ))
          )}
        </div>
      </Container>
    </div>
  );
}

export default UserFeedPage;
