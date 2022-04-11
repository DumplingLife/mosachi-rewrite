import React from 'react';
import { createRoot } from 'react-dom/client';
import Period from './Period.jsx';

const demoPeriod = {
    name: 'Biology (Demo)',
    assignments: [
        {name: 'Unit 1 Test', category: 2, pointsEarned: 'Not graded', pointsPossible: 40},
        {name: 'Worksheet 1.6', category: 0, pointsEarned: 'Not graded', pointsPossible: 10},
        {name: 'Cell diagrams', category: 1, pointsEarned: 28.5, pointsPossible: 30},
        {name: 'Worksheet 1.5', category: 0, pointsEarned: 0, pointsPossible: 10},
        {name: 'Worksheet 1.4', category: 0, pointsEarned: 10, pointsPossible: 10},
        {name: 'Quiz 1.1 to 1.3', category: 2, pointsEarned: 9.67, pointsPossible: 10},
        {name: 'Worksheet 1.3', category: 0, pointsEarned: 10, pointsPossible: 10},
        {name: 'Worksheet 1.2', category: 0, pointsEarned: 7, pointsPossible: 10},
        {name: 'Worksheet 1.1', category: 0, pointsEarned: 10, pointsPossible: 10},
    ],
    categories: [
        {name: 'Homework', weight: 0.2},
        {name: 'Projects', weight: 0.4},
        {name: 'Tests', weight: 0.4},
    ],
};

const root = createRoot(document.getElementById('demo-root'));
root.render(<Period period={demoPeriod} demo={true} />);