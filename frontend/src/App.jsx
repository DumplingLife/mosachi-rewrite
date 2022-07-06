import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GradesPages from './GradesPages.jsx';
import LoginPage from './LoginPage.jsx';

export default function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/periods/*' element={<GradesPages />} />
            </Routes>
        </BrowserRouter>
    );
}