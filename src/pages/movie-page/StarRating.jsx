import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";

const StarRating = ({ rateScore, ratingFunction, component = null }) => {
  const [hover, setHover] = useState(0);

  let starButtons;

  if (component === "review-card") {
    starButtons = [...Array(10)].map((star, index) => {
      index += 1;
      return (
        <button type="button" key={index} className={index <= rateScore ? "on px-0" : "off px-0"}>
          <span className="star">
            <i className="fa fa-star"></i>
          </span>
        </button>
      );
    });
  } else {
    starButtons = [...Array(10)].map((star, index) => {
      index += 1;
      return (
        <button
          type="button"
          key={index}
          className={index <= (hover || rateScore) ? "on" : "off"}
          onClick={() => ratingFunction(index)}
          onMouseEnter={() => setHover(index)}
          onMouseLeave={() => setHover(rateScore)}>
          <span className="star">
            <Tooltip title={index} placement="top">
              <i className="fa fa-star fa-2x"></i>
            </Tooltip>
          </span>
        </button>
      );
    });
  }
  return <div className="star-rating text-start">Rating: {starButtons}</div>;
};

export default StarRating;
