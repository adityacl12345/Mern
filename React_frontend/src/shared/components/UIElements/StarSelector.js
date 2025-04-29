import React, { useState } from 'react';
import './StarSelector.css'; // We'll write some CSS for this

const StarSelector = ({ onRatingChange }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);

  const handleClick = (rating) => {
    setSelected(rating);
    onRatingChange(rating);  // Send selected rating to parent
  };

  const handleMouseEnter = (rating) => {
    setHovered(rating);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  return (
    <div className="star-selector">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || selected) ? 'filled' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          role="button"
          aria-label={`${star} Star`}
          tabIndex={0}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarSelector;
