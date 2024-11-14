import React, { useState } from 'react';
import './GallerySlider.css';

const GallerySlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="gallery-slider">
      <button onClick={handlePrev} className="slider-button prev-button">
        &#9664;
      </button>

      <div className="slider-image-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="gallery slide"
            className={`slider-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>

      <button onClick={handleNext} className="slider-button next-button">
        &#9654;
      </button>

      <div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default GallerySlider;
