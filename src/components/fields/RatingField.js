import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RatingField = ({ value = "", onChange, readOnly, preview, hidden }) => {
  const [rating, setRating] = useState(value || 0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    onChange(newRating); // Pass the new rating to the parent component
  };

  return (
    <div className="flex flex-col items-start space-y-2" hidden={hidden}>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={`cursor-pointer text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } hover:text-yellow-500`}
            onClick={() => handleRatingChange(star)}
          />
        ))}
      </div>
      <div className="text-sm text-gray-600">{rating} out of 5</div>
    </div>
  );
};

export default RatingField;
