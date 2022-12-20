import React from 'react';
import Helmet from 'react-helmet';
import './blog.css';

export default function Blog(props) {
    return (
        <>
            <Helmet>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1524304756947795" crossorigin="anonymous"></script>
            </Helmet>
            <div className="blog-container">
                <h1 className="blog-heading">{props.heading}</h1>
                <p className="blog-text">{props.text}</p>
            </div>
        </>
    );
}