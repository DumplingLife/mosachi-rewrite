import React from 'react';
import logoCircle from './logo-circle.png';
import titleLogoWhite from './title-logo-white.svg';

export default function Footer(props) {
    return (
        <footer className="footer">
            <img className="footer-logo-circle" src={logoCircle} />
            <img className="footer-logo-text" src={titleLogoWhite} />
            <a className="footer-link" href="/blog">Blog</a>
            <a className="footer-link" href="/terms-and-conditions">Terms and Condtitions</a>
        </footer>
    );
}