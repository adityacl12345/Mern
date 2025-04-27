import React from "react";
import Card from "../../shared/components/UIElements/Card";

const Contact = () => {
    return (
        <Card>
            <h1>Contact Us</h1>
            <div className="contact-logo"></div>
            <p><strong>Email:</strong> support@cholbro.com</p>
            <p><strong>Phone:</strong> +91-9330410952</p>
            <p><strong>Location:</strong> Kolkata, India</p>
        </Card>
    );
}

export default Contact;