import React from 'react';
import Period from './Period.jsx';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

//wrapper component for Period that handles url params (takes gradebook as props, passes only the needed period to Period)
export default function PeriodWrapper(props) {
    const params = useParams();

    return (
        <Period period={props.initialGradebook[params.id-1]} demo={false} />
    );
}


