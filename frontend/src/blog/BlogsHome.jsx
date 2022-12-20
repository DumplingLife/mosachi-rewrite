import React from 'react';
import blogsData from './blogsData.js';

export default function BlogsHome(props) {
    return (
        <div className="blog-container">
            <h1>Blogs</h1>
            <ul>
                {blogsData.map((blogData) => <li><a href={`/blog/${blogData.url}`}>{blogData.heading}</a></li>)}
            </ul>
        </div>
    );
}