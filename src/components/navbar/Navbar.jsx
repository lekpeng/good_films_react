import { Navbar, Nav, NavDropdown, Container, Col } from "react-bootstrap";
import LogoutComp from "../logout/Logout";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import SearchMovies from "./SearchMovies";
import FollowingModal from "../../pages/profile-page/FollowingModal";
import { useState, useEffect } from "react";
import profileApis from "../../utils/profile";

function Navibar({ tokenState, user, setTokenState, followees, followingCount }) {
  const navigate = useNavigate();

  // const [userHairLength, setUserHairLength] = useState(null);

  // useEffect(() => {
  //   const fetchUserGender = async () => {
  //     try {
  //       const response = await profileApis.getGender(user);
  //       setUserHairLength(response.data.gender === "female" ? "longHair" : "shortHair");
  //     } catch (err) {
  //       setUserHairLength("shortHair");
  //     }
  //   };
  //   if (user) {
  //     fetchUserGender();
  //   }
  // }, []);

  const navToProfile = () => {
    navigate("/profiles/" + user);
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      sticky="top"
      style={{ color: "white", margin: "0px 0px 50px 0px" }}>
      {tokenState ? (
        <Container fluid>
          <Col className="d-flex justify-content-start align-items-center">
            <Navbar.Brand className="me-4">Good Films</Navbar.Brand>
            <LinkContainer to={"/home"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Home</Nav.Link>
            </LinkContainer>

            <LinkContainer to={"/movies"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Browse </Nav.Link>
            </LinkContainer>
          </Col>
          <Col xs={5}>
            <SearchMovies />
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <img
              className="navbar-avatar"
              src={`https://avatars.dicebear.com/api/avataaars/${user}.svg?size=35&radius=50`}></img>{" "}
            {/* {userHairLength ? (
              <img
                className="navbar-avatar"
                src={`https://avatars.dicebear.com/api/avataaars/${user}.svg?top=${userHairLength}&facialHairChance=0&size=35&radius=50`}></img>
            ) : (
              <></>
            )}{" "} */}
            <NavDropdown
              className="me-4"
              title={"Hi, " + user + "!"}
              id="navbarScrollingDropdown"
              align="end">
              <NavDropdown.Item id="profileDropdown" onClick={navToProfile}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item>
                {followees && (
                  <FollowingModal followees={followees} followingCount={followingCount} />
                )}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item id="logoutDropdown">
                <LogoutComp setTokenState={setTokenState} />
              </NavDropdown.Item>
            </NavDropdown>
          </Col>
        </Container>
      ) : (
        <Container fluid>
          <Col className="d-flex justify-content-start align-items-center">
            <Navbar.Brand className="mr-4">Good Films</Navbar.Brand>
            <LinkContainer to={"/"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Browse </Nav.Link>
            </LinkContainer>
          </Col>
          <Col xs={3}>
            <SearchMovies />
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <LinkContainer to={"/login"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Login </Nav.Link>
            </LinkContainer>
            <LinkContainer to={"/register"} style={{ color: "inherit", textDecoration: "inherit" }}>
              <Nav.Link className="d-inline-block me-4">Register </Nav.Link>
            </LinkContainer>
          </Col>
        </Container>
      )}
    </Navbar>
  );
}

export default Navibar;
