import React from "react";

import insta from "../../../assets/insta.png"
import meta from "../../../assets/meta.png";
import github from "../../../assets/github.png";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
        <div className="footer-top">
            <div className="footer-section">
            <h3>Explore</h3>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href={`/places`}>Destinations</a></li>
                <li><a href="/#About">About Us</a></li>
            </ul>
            </div>

            <div className="footer-section">
            <h3>Support</h3>
            <ul>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/privacy">Privacy</a></li>
            </ul>
            </div>

            <div className="footer-section">
            <h3>Stay Connected</h3>
            <p>Follow us for travel tips and stories</p>
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

        <div className="footer-bottom">
            <p>© {new Date().getFullYear()} CholBro</p>
        </div>
        </footer>
    );
};

export default Footer;
