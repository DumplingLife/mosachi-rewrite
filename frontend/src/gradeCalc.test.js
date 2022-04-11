const gradeCalc = require('./gradeCalc.js');
const period = require('./gradeCalcTestPeriod.json');
const assignment1 = {
    name: 'Name with symbols ⚽',
    pointsEarned: 3,
    pointsPossible: 5,
    category: -1,
};
const assignment2 = {
    name: 'Test assignment',
    pointsEarned: 'Not graded',
    pointsPossible: 5,
    category: -1,
};
const assignment3 = {
    name: 'Test assignment',
    pointsEarned: 'Not graded',
    pointsPossible: 'Not graded',
    category: -1,
};

test('points earned display', () => {
    expect(gradeCalc.getAssignmentPointsEarnedDisplay(assignment1)).toBe('3');
});
test('points possible display', () => {
    expect(gradeCalc.getAssignmentPointsPossibleDisplay(assignment1)).toBe('5');
});
test('points earned display, for not graded', () => {
    expect(gradeCalc.getAssignmentPointsEarnedDisplay(assignment3)).toBe('Not graded');
});
test('points possible display, for not graded', () => {
    expect(gradeCalc.getAssignmentPointsPossibleDisplay(assignment3)).toBe('Not graded');
});
test('period grade display', () => {
    expect(gradeCalc.calculateGradeDisplay(period)).toBe('91.17');
});
test('category details display', () => {
    expect(gradeCalc.calculateCategoryDetailsDisplay(period)).toEqual([
        {"displayGrade": "91.76%", "displayWeight": "40%", "grade": 0.9175757575757576, "name": "Reading", "pointsEarned": 30.28, "pointsPossible": 33, "weight": 0.4},
        {"displayGrade": "90.50%", "displayWeight": "35%", "grade": 0.905, "name": "Literary argument", "pointsEarned": 9.05, "pointsPossible": 10, "weight": 0.35},
        {"displayGrade": "N/A", "displayWeight": "5%", "grade": "Not graded", "name": "Speaking", "pointsEarned": 0, "pointsPossible": 0, "weight": 0.05},
        {"displayGrade": "N/A", "displayWeight": "20%", "grade": "Not graded", "name": "Writing", "pointsEarned": 0, "pointsPossible": 0, "weight": 0.2}
    ]);
});
test('assignment weight display', () => {
    expect(gradeCalc.calculateAssignmentWeightDisplay(period, 0)).toBe('1.57%');
});
test('assignment grade display', () => {
    expect(gradeCalc.calculateAssignmentGradeDisplay(assignment1)).toBe('60.00%');
});
test('assignment grade display, for not graded', () => {
    expect(gradeCalc.calculateAssignmentGradeDisplay(assignment2)).toBe('N/A');
});
test('points needed display is correct', () => {
    expect(gradeCalc.calculatePointsNeededDisplay(period, 0, 0.9)).toBe('0.17');
});
