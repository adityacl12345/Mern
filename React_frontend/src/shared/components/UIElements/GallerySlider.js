import React, { useState } from 'react';
import './GallerySlider.css';

const GallerySlider = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = props.images;
  const thumb = props.thumb;
  const dots = props.dots;

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
    <div className={`gallery-slider ${thumb ? 'thumbnails' : ''}`}>
      <button onClick={handlePrev} className="slider-button prev-button">
        &#9664;
      </button>

      <div className="slider-image-container">
        {images.map((image, index) => (
          <img
            key={index}
            src={props.ext ? image:`${process.env.REACT_APP_ASSETS_URL}${image}`}
            alt="gallery slide"
            className={`slider-image ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <button onClick={handleNext} className="slider-button next-button">
        &#9654;
      </button>

      {dots &&<div className="slider-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>}
      {thumb && 
        <div className="slider-thumbnails">
          {images.map((img, index) => (
            <img
              key={index}
              alt={`thumbnail-${index}`}
              src={`${process.env.REACT_APP_ASSETS_URL}${img}`}
              className={`thumb ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            ></img>
          ))}
        </div>}
    </div>
  );
};

export default GallerySlider;
