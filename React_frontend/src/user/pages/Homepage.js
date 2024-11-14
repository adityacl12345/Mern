import React from "react";

import './Homepage.css';
import GallerySlider from "../../shared/components/UIElements/GallerySlider";
import User from "./User";

const Homepage = () => {
    const images = [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',  // Beach sunset
        'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a',  // Mountain view
        'https://images.unsplash.com/photo-1493558103817-58b2924bce98',  // Tropical island
        'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef',  // Snowy mountains
        'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',  // Historic city street
    ];
    return (
        <React.Fragment>
            <section className="Head-gallery">
                <GallerySlider images={images}></GallerySlider>
            </section>
            <section className="About">
                <div className="main-content">
                    <h1>About us</h1>
                    Welcome to [Your Vacation Site Name] – your gateway to unforgettable adventures and breathtaking escapes! We believe that travel is more than just a trip; it’s an opportunity to connect with the world, create lasting memories, and recharge your spirit. That’s why we’re dedicated to curating exceptional vacation experiences that cater to every traveler’s dream – whether you're seeking sun-soaked beaches, scenic mountain getaways, cultural city explorations, or off-the-beaten-path adventures. Our team of travel enthusiasts and experts works tirelessly to bring you the best of every destination. We’re passionate about finding hidden gems, offering personalized recommendations, and ensuring your journey is smooth from start to finish. From luxurious resorts and charming boutique stays to immersive tours and unique local experiences, we’re here to help you design your perfect getaway. Let us take care of the details so you can focus on what matters most – enjoying every moment. Discover, dream, and travel with [Your Vacation Site Name]. Your next adventure awaits!</div>
                <div className="image-content"></div>
            </section>
            <section className="Testimonials">

            </section>
            <section className="Users">
                <User></User>
            </section>
        </React.Fragment>
    );
};

export default Homepage;