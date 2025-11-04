import React from "react";
import { Link } from "react-router-dom";
import "../../Onboarding.css";



export default function GetStartedPage() {
    return(
        <div className="get-started">
            <div className="image-section">
                <img src="https://c8.alamy.com/comp/2AF2X77/happy-lady-listening-to-music-through-wireless-headphones-2AF2X77.jpg" alt="Mental Wellness" />
            </div>
            <div className="button-section">
                <h1>Your Mental Health Simplified</h1>
                <p>All your mental problems solution</p>
                <div className="buttons">
                    <Link to="/signup"><button className="primary-btn">Sign Up</button></Link>
                    <Link to ='/signin' className="secondary-btn">Login</Link>
                </div>
            </div>
        </div>
    )
}