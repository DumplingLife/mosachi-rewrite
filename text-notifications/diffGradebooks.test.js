const diffGradebooks = require('./diffGradebooks.js');
const NOT_GRADED_STR = require('../synergy.js').NOT_GRADED_STR;

const oldGradebook = [
    {
        name: 'English 📖',
        categories: [
            {name: 'Reading', weight: 0.5},
            {name: 'Writing', weight: 0.4},
            {name: 'Listening', weight: 0.1},
        ],
        assignments: [
            {id: 1, name: 'Essay #2', category: 1, pointsEarned: 16, pointsPossible: 20},
            {id: 2, name: 'Essay #1', category: 1, pointsEarned: 18.50, pointsPossible: 20},
            {id: 3, name: 'Reading test', category: 0, pointsEarned: NOT_GRADED_STR, pointsPossible: 10},
        ],
    },
    {
        name: 'Biology',
        categories: [],
        assignments: [],
    },
    {
        name: 'Piano',
        categories: [],
        assignments: [],
    },
];

const newGradebook = [
    {
        name: 'English 📖',
        categories: [
            {name: 'Reading', weight: 0.5},
            {name: 'Writing', weight: 0.4},
            {name: 'Listening', weight: 0.1},
        ],
        assignments: [
            {id: 3, name: 'Reading test', category: 0, pointsEarned: 8, pointsPossible: 10},
            {id: 1, name: 'Essay #2', category: 1, pointsEarned: 16, pointsPossible: 20},
            {id: 2, name: 'Essay #1', category: 1, pointsEarned: 18.50, pointsPossible: 20},
        ],
    },
    {
        name: 'Biology',
        categories: [{name: 'Homework', weight: 1}],
        assignments: [
            {id: 1, name: 'Week 1 Homework ✏️', category: 0, pointsEarned: 4, pointsPossible: 5},
        ],
    },
    {
        name: 'Piano',
        categories: [],
        assignments: [],
    },
];

test('diffGradebooks', () => {
    expect(diffGradebooks.diffGradebooks(oldGradebook, newGradebook)).toEqual([
        {
            diffType: diffGradebooks.ASSIGNMENT_DIFF_TYPE_POINTS_CHANGE,
            newAssignment: {id: 3, name: 'Reading test', category: 0, pointsEarned: 8, pointsPossible: 10},
        },
        {
            diffType: diffGradebooks.ASSIGNMENT_DIFF_TYPE_NEW_ASSIGNMENT,
            newAssignment: {id: 1, name: 'Week 1 Homework ✏️', category: 0, pointsEarned: 4, pointsPossible: 5},
        },
    ]);
});