import React from "react";

import insta from "../../../assets/insta.png"
import meta from "../../../assets/meta.png";
import github from "../../../assets/github.png";

const SocialIcons = () => {
    return (
        <div className="social-icons-float">
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
    )
}

export default SocialIcons;