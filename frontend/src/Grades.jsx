import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PeriodsTable from './PeriodsTable.jsx';
import PeriodWrapper from './PeriodWrapper.jsx';

export default function Grades(props) {
    const [gradebook, setGradebook] = useState({
        data: {},
        loaded: false,
    });

    useEffect(() => {
        fetch('/get-gradebook')
            .then((res) => res.json())
            .then((res) => {
                setGradebook({
                    loaded: true,
                    data: res,
                });
            });
    }, []);

    if(!gradebook.loaded) {
        return <p>loading...</p>;
    }
    else {
        return (
            <Routes>
                <Route path='/' element={<PeriodsTable gradebook={gradebook.data} />} />
                <Route path='/:id' element={<PeriodWrapper initialGradebook={gradebook.data} />} />
            </Routes>
        );
    }
}