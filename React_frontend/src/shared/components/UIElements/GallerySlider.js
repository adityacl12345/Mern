import React, { useEffect, useState } from 'react';
import './GallerySlider.css';

const GallerySlider = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = props.images;
  const thumb = props.thumb;
  const dots = props.dots;
  const autoSlide = props.autoSlide;
  const overlay = props.overlay;
  const autoScroll = props.autoScroll;

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

  useEffect(() => {
    if(!autoSlide || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [autoSlide, images.length])

  return (
    <div className={`gallery-slider ${thumb ? 'thumbnails' : ''} ${autoScroll ? 'scroll' : ''}`}>
      {!autoScroll && <div onClick={handlePrev} className="slider-button prev-button"></div>}
      <div className={`slider-image-container`}>
        {images?.map((image, index) => (
          <div key={index} className={`slider-image ${index === currentIndex ? 'active' : ''} ${overlay ? 'image-overlay' : ''}`}>
            <img
            src={props.ext ? image:`${process.env.REACT_APP_ASSETS_URL}${image}`}
            alt="gallery slide"
          /></div>
        ))}
      </div>
      {!autoScroll && <div onClick={handleNext} className="slider-button next-button"></div>}

      {dots && !autoScroll && <div className="slider-dots">
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
