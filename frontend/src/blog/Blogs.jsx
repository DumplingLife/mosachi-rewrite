import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Blog from './Blog.jsx';
import BlogsHome from './BlogsHome.jsx';
import blogsData from './blogsData.js';

export default function Blogs(props) {
    return (
        <Routes>
            <Route path='' element={<BlogsHome />} />
            {blogsData.map((blogData) => <Route path={blogData.url} element={<Blog heading={blogData.heading} text={blogData.text} />} />)}
        </Routes>
    );
}