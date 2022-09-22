import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ReviewCard from "./ReviewCard";
import profileApis from "../../utils/profile";
import ErrorPage from "../../components/error-page/ErrorPage";
import FollowingModal from "./FollowingModal";
import FollowUnfollowButton from "./FollowUnfollowButton";
import SearchUsers from "./SearchUsers";
import jwt_decode from "jwt-decode";
import { CircularProgress } from "@mui/material";

function ProfilePage(props) {
  console.log("profile page props", props);
  const params = useParams();
  // const [profileInViewUsername, setProfileInViewUsername] = useState(params.username);
  const [profile, setProfile] = useState({});
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [followeeOptions, setFolloweeOptions] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  // const [userHairLength, setUserHairLength] = useState(null);

  const token = "Bearer " + localStorage.getItem("user_token");
  const currentUserUsername = jwt_decode(token).data.username;

  // useEffect(() => {
  //   setProfileInViewUsername(params.username);
  // }, [params.username]);

  useEffect(() => {
    const fetchProfile = async (type, username) => {
      try {
        const profileResult = await profileApis.getProfile(username, token);
        if (type === "profileInView") {
          setProfile(profileResult.data);
        } else {
          setCurrentUserProfile(profileResult.data);
        }
      } catch (err) {
        setErrorMsg(err.response.data.error);
      }
    };
    const fetchAllUsers = async () => {
      try {
        const profilesResult = await profileApis.getProfiles(token);
        setFolloweeOptions(profilesResult.data.map((profile) => profile.username));
      } catch (err) {
        toast.error(err.response.data.error);
      }
    };
    // const fetchUserGender = async () => {
    //   try {
    //     const response = await profileApis.getGender(params.username);
    //     setUserHairLength(response.data.gender === "female" ? "longHair" : "shortHair");
    //   } catch (err) {
    //     setUserHairLength("shortHair");
    //   }
    // };

    // setIsFollowing(false);
    fetchProfile("profileInView", params.username);
    fetchProfile("currentUser", currentUserUsername);
    fetchAllUsers();
    // fetchUserGender();
  }, [params.username]);

  if (errorMsg) {
    return <ErrorPage message={errorMsg} />;
  }

  return (
    <div className="profile-page">
      <Container className="container-restrict-width">
        <h1>Profile</h1>
        <Row className="d-flex justify-content-center mb-5">
          <Col md={5}>
            <SearchUsers
              followeeOptions={followeeOptions}
              profileInViewUsername={params.username}
            />
          </Col>
        </Row>

        <div className="profile mt-5">
          <img
            className="review-card-avatar"
            src={`https://avatars.dicebear.com/api/avataaars/${profile.username}.svg?size=80&radius=50`}></img>{" "}
          {/* {userHairLength ? (
            <img
              className="review-card-avatar"
              src={`https://avatars.dicebear.com/api/avataaars/${profile.username}.svg?top=${userHairLength}&facialHairChance=0&size=80&radius=50`}></img>
          ) : (
            <></>
          )}{" "} */}
          <h2>{profile.username}</h2>
          {!profile.isCurrentUser && (
            <FollowUnfollowButton
              profileInViewUsername={params.username}
              currentUserProfile={currentUserProfile}
              setCurrentUserProfile={setCurrentUserProfile}
              setFollowState={props.setFollowState}
              followState={props.followState}
            />
          )}
          <FollowingModal
            followees={profile.followees}
            profileInViewUsername={params.username}
            page={"profile-page"}
          />
          <h5>Watched {profile.reviews && profile.reviews.length} film(s)</h5>
        </div>
        {!profile.reviews ? (
          <CircularProgress />
        ) : (
          <div className="reviews">
            {profile.reviews &&
              profile.reviews.map((review) => (
                <ReviewCard key={review._id} reviewId={review._id} page={"profile-page"} />
              ))}
          </div>
        )}
        {/* <div className="reviews">
          {profile.reviews &&
            profile.reviews.map((review) => (
              <ReviewCard key={review._id} reviewId={review._id} page={"profile-page"} />
            ))}
        </div> */}
      </Container>
    </div>
  );
}

export default ProfilePage;
