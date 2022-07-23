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
                </Helmet>
                <Routes>
                    <Route path='/' element={<PeriodsTable gradebook={gradebook.data} />} />
                    <Route path='/:id' element={<PeriodWrapper initialGradebook={gradebook.data} />} />
                </Routes>
                {/* media.net ads */}
                <div id="452247345">
                    <script type="text/javascript">
                        {`try {
                            console.log(1);
                            window._mNHandle.queue.push(function (){
                                window._mNDetails.loadTag("452247345", "160x600", "452247345");
                            });
                        }
                        catch (error) {
                            console.log(error);
                        }`}
                    </script>
                </div>
            </>
        );
    }
}