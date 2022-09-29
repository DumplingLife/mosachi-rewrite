import React from 'react';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { calculateGradeDisplay } from './gradeCalc.js';
import TextNotificationsSignUp from './text-notifications/TextNotificationsSignUp.jsx';
import TextNotificationsDelete from './text-notifications/TextNotificationsDelete.jsx';

export default function PeriodsTable(props) {
    let periodRows = [];
    for(let i=0; i<props.gradebook.length; i++) {
        let period = props.gradebook[i];
        periodRows.push(<PeriodRow key={i} period={period} periodInd={i} />);
    }

    return (
        <>
            <Link className='logout-button-wrapper' to='/login'>
                <Button className='logout-button' variant='outline-secondary'>Logout</Button>
            </Link>
            <div className='periods-list-page-container'>
                <div className='title-wrapper'>
                    <div className='title display-4'>Welcome</div>
                </div>
                <div className='periods-table'>
                    {periodRows}
                </div>
                <TextNotificationsSignUp />
                <TextNotificationsDelete />
            </div>
        </>
    );
}

function PeriodRow(props) {
    return (
        <div className='period-row'>
            <div className='period-row-left'>
                <p className='period-row-name'>{props.period.name}</p>
                <p className='period-row-grade'>{calculateGradeDisplay(props.period)}</p>
            </div>
            <div className='period-row-right'>
                <Link className='btn btn-primary period-row-details-button' to={`/periods/${props.periodInd+1}`}>
                    <div className='period-row-details-text'>Details</div>
                    <i className='period-row-details-right-arrow fa fa-arrow-circle-right' aria-hidden='true'></i>
                </Link>
            </div>
        </div>
    );
}