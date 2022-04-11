import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Grades from './Grades.jsx';
import Login from './Login.jsx';

export default function App(props) {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/periods/*' element={<Grades />} />
            </Routes>
        </BrowserRouter>
    );
}