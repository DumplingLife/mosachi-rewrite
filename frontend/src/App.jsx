import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GradesPages from './grades-pages/GradesPages.jsx';
import LoginPage from './LoginPage.jsx';
import LandingPage from './landing-page/LandingPage.jsx';
import Blogs from './blog/Blogs.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import Footer from './Footer.jsx';
import './index.css';

export default function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<>
                    <LandingPage />
                    <Footer />
                </>} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/periods/*' element={<GradesPages />} />
                <Route path='/blog/*' element={<>
                    <Blogs />
                    <Footer />
                </>} />
                <Route path='/terms-and-conditions' element={<>
                    <TermsAndConditions />
                    <Footer />
                </>} />
            </Routes>
        </BrowserRouter>
    );
}