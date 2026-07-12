import React, { useState } from "react";

const RatingStars = ({
  rating = 0,
  maxStars = 5,
  interactive = false,
  onChange,
  size = "text-lg"
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (starVal) => {
    if (interactive && onChange) {
      onChange(starVal);
    }
  };

  const handleMouseEnter = (starVal) => {
    if (interactive) {
      setHoverRating(starVal);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const isFilled = hoverRating ? i <= hoverRating : i <= rating;
    stars.push(
      <span
        key={i}
        onClick={() => handleClick(i)}
        onMouseEnter={() => handleMouseEnter(i)}
        onMouseLeave={handleMouseLeave}
        className={`${size} ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""} ${
          isFilled ? "text-amber-500 fill-amber-500" : "text-gray-300"
        }`}
      >
        <i className={isFilled ? "ri-star-fill" : "ri-star-line"}></i>
      </span>
    );
  }

  return <div className="flex gap-1 items-center">{stars}</div>;
};

export default RatingStars;
