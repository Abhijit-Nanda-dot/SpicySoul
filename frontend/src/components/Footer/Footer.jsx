import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
const Footer = () => {
  return (
    <div className="footer" id='footer'>
    <div className="footer-content">

        <div className="footer-content-left">

            <img src={assets.logo} alt="Logo"></img>
            <p>Spicy Soul is a creative brand where we blend modern design with expressive storytelling to create work that feels warm, personal, and memorable. Our goal is simple — to make ideas come alive with style, clarity, and soul.</p>

            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="Facebook" />
                <img src={assets.twitter_icon} alt="Twitter" />
                <img src={assets.linkedin_icon} alt="LinkedIn" />
            </div>

        </div>

        <div className="footer-content-center">
            <h2>Company</h2>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div className="footer-content-right">
             <h2>Get in touch</h2>  
             <ul>
                <li>+91 9732809936</li>
                <li>abhi2005jit@gmail.com</li>
             </ul>
        </div>
    </div>
    <hr className='hr'/>
    <p className="footer-copyright">&copy; 2024 SpicySoul -- All rights reserved.</p>
    </div>
  );
};

export default Footer;