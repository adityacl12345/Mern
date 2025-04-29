import React from 'react';
import './AverageRating.css'; // Optional for styles

const AverageRating = ({ averageRating }) => {
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="average-star-display">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} role="img" aria-label="Full Star" className="star full">★</span>
      ))}
      {hasHalfStar && <span role="img" aria-label="Half Star" className="star half">★</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} role="img" aria-label="Empty Star" className="star empty">★</span>
      ))}
      <span className="rating-number">({averageRating.toFixed(1)})</span>
    </div>
  );
};

export default AverageRating;
