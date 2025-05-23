import React, { useEffect } from "react";
import insta from "../../assets/insta.png"
import meta from "../../assets/meta.png";
import github from "../../assets/github.png";
import './Homepage.css';
import GallerySlider from "../../shared/components/UIElements/GallerySlider";
import User from "./User";
import Button from "../../shared/components/FormElements/Button";
import AOS from "aos";
import '../../../node_modules/aos/dist/aos.css';
import TestimonialList from "../components/TestimonialList";

const Homepage = () => {
    const images = [
        require("../../assets/gallery-1.jpg"),
        require("../../assets/gallery-2.jpg"),
        require("../../assets/gallery-3.jpg"),
        require("../../assets/gallery-4.jpg"),
        require("../../assets/gallery-5.jpg"),
    ];

    useEffect(() => {
        AOS.init({
          duration: 1000 
        });
    }, []);

    
      
    return (
        <React.Fragment>
            <section id="Hero"className="Head-gallery">
                <div className="main-block">
                    <GallerySlider ext dots autoScroll images={images}></GallerySlider>
                    <div className="caption">
                        <div className="typing-text">Where </div>
                        <div className="typing-text">Did you go?</div>
                        <div className="typing-text">this summer?</div>
                        <Button to='/places/new'>ADD PLACE</Button>
                    </div>
                    
                    <div className="scroll-indicator">
                        <span className="down-arrow"></span>
                    </div>
                    <div className="bottom-overlay"></div>
                </div>
            </section>
            <section id="About" className="About">
                <div className="main-block" data-aos="fade-left">
                    <h1>About us</h1>
                    <article className="main-content flex">
                        <p>Welcome to <strong>CholBro</strong> – your gateway to unforgettable adventures and breathtaking escapes! We believe that travel is more than just a trip; it’s an opportunity to connect with the world, create lasting memories, and recharge your spirit. <br/>
                        So <i>"Chol Bro"</i> let's create exceptional vacation experiences that cater to every traveler’s dream – whether you're seeking sun-soaked beaches, scenic mountain getaways, cultural city explorations, or off-the-beaten-path adventures. Our team of travel enthusiasts and experts works tirelessly to bring you the best of every destination. <br/>
                        We’re passionate about finding hidden gems, offering personalized recommendations, and ensuring your journey is smooth from start to finish. From luxurious resorts and charming boutique stays to immersive tours and unique local experiences, we’re here to help you design your perfect getaway. Let us take care of the details so you can focus on what matters most – enjoying every moment. Discover, dream, and travel with CholBro. ✈️ Your next adventure awaits!</p>
                        <div className="image-content" data-aos="flip-up"></div>
                    </article>
                </div>
            </section>
            <section id="Users"className="Users">
                <div className="main-block" data-aos="fade-right">
                    <h1>Our Travellers</h1>
                    <div className="main-content">
                        <div className="scroll-indicator left"></div>
                        <User></User>
                    </div>
                </div>
            </section>
            <section id="Testimonials" className="testimonials">
                <div className="main-block" data-aos="zoom-in">
                    <h1>What Our Travelers Say</h1>
                    <div className="main-content">
                        <div className="scroll-indicator left"></div>
                        <TestimonialList></TestimonialList>
                    </div>
                </div>
            </section>
            <section id="Social" className="community">
                <div className="main-block" data-aos="zoom-in">
                    <h1>Join Our Community</h1>
                    <div className="main-content flex">
                        <div className="contact-logo"></div>
                        <div className="community-links">
                            <p>Be part of a growing community of travelers, storytellers, and explorers. Share your journeys, discover hidden gems, and connect with like-minded adventurers from around the world.
                            Whether you're planning your next trip or just love to be inspired—Cholbro is your travel tribe.

                            Let’s explore the world together.
                            Join us today!</p>
                            <div className="social-icons">
                                <a href="https://www.instagram.com/adityapsycho" target="_blank" rel="noopener noreferrer">
                                    <img src={insta} alt="Instagram" />
                                </a>
                                <a href="https://www.facebook.com/aditya.ghosh.79" target="_blank" rel="noopener noreferrer">
                                    <img src={meta} alt="Meta" />
                                </a>
                                <a href="https://github.com/adityacl12345" target="_blank" rel="noopener noreferrer">
                                    <img src={github} alt="GitHub" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Homepage;