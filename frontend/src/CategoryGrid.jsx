import React from 'react';
import _ from 'lodash';
import { calculateCategoryDetailsDisplay } from './gradeCalc.js';

export default function CategoryGrid(props) {
    let categoryRows = [];
    let categories = calculateCategoryDetailsDisplay(props.period);
    for(let i=0; i<categories.length; i++) {
        let category = categories[i];
        categoryRows.push(<CategoryRow
            key={i}
            name={category.name}
            pointsEarned={category.pointsEarned}
            pointsPossible={category.pointsPossible}
            weight={category.displayWeight}
            grade={category.displayGrade}
        />);
    } 

    return (
        <div className='category-grid-container'>
            <p>Category List</p>
            <div className='category-grid'>
                <div className='category-row category-grid-header row'>
                    <div className='category-col col'>Name</div>
                    <div className='category-col col'>Points Earned</div>
                    <div className='category-col col'>Points Possible</div>
                    <div className='category-col col'>Weight</div>
                    <div className='category-col col'>Grade</div>
                </div>
                {categoryRows}
            </div>
        </div>
    );
}



function CategoryRow(props) {
    return (
        <div className='category-row row'>
            <div className='category-col col'>{props.name}</div>
            <div className='category-col col'>{props.pointsEarned}</div>
            <div className='category-col col'>{props.pointsPossible}</div>
            <div className='category-col col'>{props.weight}</div>
            <div className='category-col col'>{props.grade}</div>
        </div>
    );
}