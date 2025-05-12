import React, { useEffect, useState } from "react";
import Card from "../../shared/components/UIElements/Card";
import ItemCarousel from "../../shared/components/UIElements/ItemCarousel";

import './TestimonialList.css';

const TestimonialList = () => {
    const [testimonials, setTestimonials] = useState([]);
    useEffect(() => {
        const fetchTestimonials = async () => {
          try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/comments/top-liked`);
            const data = await response.json();
            setTestimonials(data.testimonials);
          } catch (err) {
            console.error('Failed to load testimonials:', err);
          }
        };
    
        fetchTestimonials();
    }, []);

    const TestimonialItems = testimonials?.map(item => (
        <div key={item.id} className="testimonial-card">
            <div className="place-image">
                <img src={`${process.env.REACT_APP_ASSETS_URL}${item.place.image}`} alt={item.place.name} />
            </div>
            <h3>{item.place.name}</h3>
            <div className="user">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/${item.user.image}`} alt={item.user.name} />
                <span>{item.user.name}</span>
            </div>
            <blockquote className="testimonial-comment">“{item.text}”</blockquote>
            <div className="testimonial-bottom flex center">
                <span role="img" aria-label="like"> ❤️ {item.likes}</span>
                <a className="read-more-btn" href={`/place/${item.place.id}#comment-${item.id}`}>
                    Read more
                </a>
            </div>
        </div>
    ));

    if(testimonials.length === 0) {
        return (
            <Card className="no-comments-card">
                <div>
                    <h3>No comments yet! Would you like to start off and let people know about the place?</h3>
                </div>
            </Card>
        )
    }

    return (
        <ItemCarousel items={TestimonialItems} />
    );
}

export default TestimonialList;