import Button from "react-bootstrap/Button";
import apis from "../../utils/profile";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

function FollowUnfollowButton({
  profileInViewUsername,
  currentUserProfile,
  setCurrentUserProfile,
  setFollowState,
  followState,
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const token = "Bearer " + localStorage.getItem("user_token");

  useEffect(() => {
    if (Object.keys(currentUserProfile).length) {
      console.log("currentUserProfile", currentUserProfile);
      console.log("profileInViewUsername", profileInViewUsername);
      setIsFollowing(currentUserProfile.followees.includes(profileInViewUsername));
    }
  }, [currentUserProfile]);

  const updateFollowingBackend = async (type) => {
    try {
      console.log("here321", profileInViewUsername, type);
      const followee = profileInViewUsername;
      const response = await apis.updateFollowing(followee, token, type);
      console.log("response", response);
      const updatedProfile = {
        ...currentUserProfile,
        followees: response.data.followees,
      };
      console.log("updated profile: " + JSON.stringify(updatedProfile));
      setCurrentUserProfile(updatedProfile);
      toast.success(`${type} ${followee} successful!`);
    } catch (err) {
      toast.error(err.response.data.error);
      return;
    }
  };

  const updateFollowing = (e) => {
    if (e.target.innerText === "Follow") {
      updateFollowingBackend("follow");
      setFollowState(followState + 1);
      console.log("button running");
      return;
    }
    updateFollowingBackend("unfollow");
    setFollowState(followState - 1);
    return;
  };

  if (!isFollowing) {
    return (
      <Button variant="success" onClick={updateFollowing}>
        Follow
      </Button>
    );
  }
  return (
    <Button variant="danger" onClick={updateFollowing}>
      Unfollow
    </Button>
  );
}

export default FollowUnfollowButton;
