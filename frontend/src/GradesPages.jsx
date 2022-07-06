import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PeriodsTable from './PeriodsTable.jsx';
import PeriodWrapper from './PeriodWrapper.jsx';
import { Helmet } from 'react-helmet';

export default function GradesPages(props) {
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
            <>
                <Helmet>
                    <title>Mosachi - The Smart Gradebook</title>
                    {/* adsense */}
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1524304756947795" crossorigin="anonymous"></script>
                </Helmet>
                <Routes>
                    <Route path='/' element={<PeriodsTable gradebook={gradebook.data} />} />
                    <Route path='/:id' element={<PeriodWrapper initialGradebook={gradebook.data} />} />
                </Routes>
            </>
        );
    }
}