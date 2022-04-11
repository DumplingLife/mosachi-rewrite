import React, { useState } from 'react';
import { Link } from "react-router-dom";
import AssignmentGrid from "./AssignmentGrid.jsx";
import CategoryGrid from "./CategoryGrid.jsx";
import _ from 'lodash';
import { calculateGradeDisplay } from './gradeCalc.js';

export default function Period(props) {
    //initialize state
    //attach assignment ids
    let initialPeriodWithIds = _.cloneDeep(props.period);
    for(let assignment of initialPeriodWithIds.assignments) {
        assignment.id = _.uniqueId();
    }
    const [period, setPeriod] = useState(initialPeriodWithIds);

    return (
        <div className='period-page-container'>
            <div className='period-title-wrapper'>
                <div className='period-title display-4'>{period.name}</div>
                {!props.demo ?
                <Link className='period-back-link' to='/periods'>
                    <i className='fa fa-arrow-left'></i> Back to Class List
                </Link> : null}
                
                <div className='period-grade display-2'>{calculateGradeDisplay(period)}</div>
            </div>
            <AssignmentGrid period={period} setPeriod={setPeriod} />
            <CategoryGrid period={period} />
        </div>
    );
}


