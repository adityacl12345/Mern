import React from "react";

import './Homepage.css';
import GallerySlider from "../../shared/components/UIElements/GallerySlider";
import User from "./User";
import Button from "../../shared/components/FormElements/Button";

const Homepage = () => {
    const images = [
        "https://images.pexels.com/photos/13828592/pexels-photo-13828592.jpeg",
        "https://images.pexels.com/photos/1038935/pexels-photo-1038935.jpeg",
        "https://images.pexels.com/photos/1169107/pexels-photo-1169107.jpeg",
        "https://images.pexels.com/photos/587063/pexels-photo-587063.jpeg",
        "https://images.pexels.com/photos/399192/pexels-photo-399192.jpeg",
        "https://images.pexels.com/photos/927017/pexels-photo-927017.jpeg",
        "https://images.pexels.com/photos/1010079/pexels-photo-1010079.jpeg",
        "https://images.pexels.com/photos/105293/pexels-photo-105293.jpeg",
        "https://images.pexels.com/photos/1581021/pexels-photo-1581021.jpeg",
        "https://images.pexels.com/photos/1581021/pexels-photo-1581021.jpeg"
    ];
      
    return (
        <React.Fragment>
            <section className="Head-gallery">
                <GallerySlider ext dots images={images}></GallerySlider>
                <div className="caption">
                    <div>Where did you go<br/>this summer?</div>
                    <Button to='/places/new'>ADD PLACE</Button>
                </div>
            </section>
            <section id="About" className="About">
                <h1>About us</h1>
                <div className="main-content flex">
                    <p>Welcome to CholBro – your gateway to unforgettable adventures and breathtaking escapes! We believe that travel is more than just a trip; it’s an opportunity to connect with the world, create lasting memories, and recharge your spirit. So "Chol Bro" let's create exceptional vacation experiences that cater to every traveler’s dream – whether you're seeking sun-soaked beaches, scenic mountain getaways, cultural city explorations, or off-the-beaten-path adventures. Our team of travel enthusiasts and experts works tirelessly to bring you the best of every destination. We’re passionate about finding hidden gems, offering personalized recommendations, and ensuring your journey is smooth from start to finish. From luxurious resorts and charming boutique stays to immersive tours and unique local experiences, we’re here to help you design your perfect getaway. Let us take care of the details so you can focus on what matters most – enjoying every moment. Discover, dream, and travel with CholBro. Your next adventure awaits!</p>
                    <div className="image-content"></div>
                </div>
            </section>
            <section className="Users">
                <div><h1>Users</h1></div>
                <User></User>
            </section>
            <section className="Testimonials">
                <div><h1>Testimonials</h1></div>
            </section>
        </React.Fragment>
    );
};

export default Homepage;