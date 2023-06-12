import React from 'react';
// import playStore from "../../../images/playstore.png";
// import appStore from "../../../images/Appstore.png";
import "./Footer.css";
const Footer = () => {

    return (
        <footer id="footer">
            <div className="leftFooter">
                <h1>Manufactured & Packed By</h1>
                <p>Brown Wynk Pvt.Ltd</p>
                <p>Address: Plot #123, In sub Jungalpalya, BannerGhatta road, Anekal Taluk Bangalore, Bangalore - 560083, Karnataka, India.</p>
            </div>

            <div className="midFooter">
                <h1>Brown Wynk</h1>
                <p>Fill Your Home With A Brown Wynk</p>
                <p>Create Your Own Fashion </p>
                <p>Copyrights 2022 &copy; Charan R</p>
            </div>

            <div className="rightFooter">
                <h2>For all your queries call</h2>
                <p>080-987654321</p>
                <p>We are here to help you every day between </p>
                <p>9:30 AM to 7:30 PM</p>
                <p></p>
                <h4>Follow Us</h4>
                <a href="https://www.instagram.com/_jzt_dead_07/">Instagram</a>
                <a href="http://youtube.com/Furniture">Youtube</a>
                <a href="http://instagram.com/c.hara.n_07">Facebook</a>
            </div>
        </footer>
    );
};

export default Footer