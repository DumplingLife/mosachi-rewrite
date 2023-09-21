/**
 * functions for grade display. Ideally, no grades logic should appear anywhere else
 */

import _ from 'lodash';

const NOT_GRADED_POINTS_EARNED_STR = 'Not graded';
const NOT_GRADED_POINTS_POSSIBLE_STR = 'Not graded';
const CATEGORY_NOT_GRADED_STR = 'Not graded';
const PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS = 'N/A';

function getAssignmentPointsEarnedDisplay(assignment) {
    if(assignment.pointsEarned == NOT_GRADED_POINTS_EARNED_STR) return 'Not graded';
    else return assignment.pointsEarned.toString();
}
function getAssignmentPointsPossibleDisplay(assignment) {
    if(assignment.pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR) return 'Not graded';
    else return assignment.pointsPossible.toString();
}

//calculate grade as percentage (without percent sign), round to 2 decimal points
function calculateGradeDisplay(period) {
    let grade = calculateGrade(period);
    if(grade == PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS) return 'N/A';
    else return (100*grade).toFixed(2).toString();
}

/**
 * calculate grade
 * any category out of 0 points are not counted
 *     if a category is all extra credit and is 5/0, it will also be not counted
 * return as decimal (0.912 instead of 91.2)
 */
function calculateGrade(period) {
    let categoriesWithDetails = calculateCategroyDetails(period);
    let weightOfValidCategories = 0;
    for(let category of categoriesWithDetails) {
        if(category.grade != CATEGORY_NOT_GRADED_STR) weightOfValidCategories += category.weight;
    }

    if(weightOfValidCategories == 0) return PERIOD_GRADE_IF_NO_GRADED_ASSIGNMENTS;

    let weightScale = 1/weightOfValidCategories;
    let grade = 0;
    for(let category of categoriesWithDetails) {
        if(category.grade != CATEGORY_NOT_GRADED_STR) grade += category.grade * category.weight;
    }
    grade *= weightScale;
    return grade;
}

/**
 * get category details: name, pointsEarned, pointsPossible, weight (as decimal), grade (as decimal)
 * grade for categories with 0 points possible will be the not graded string
 *     make sure this matches with other code
 *     (it doesn't need to match with assignment not graded string)
 * this will not mutate period, it will clone anything neccessary
 */
function calculateCategoryDetails(period) {
    let categories = _.cloneDeep(period.categories);
    for(let category of categories) {
        category.pointsEarned = 0;
        category.pointsPossible = 0;
    }
    for(let assignment of period.assignments) {
        if(assignment.pointsEarned == NOT_GRADED_POINTS_EARNED_STR || assignment.pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR) continue;
        else {
            categories[assignment.category].pointsEarned += assignment.pointsEarned;
            categories[assignment.category].pointsPossible += assignment.pointsPossible;
        }
    }
    for(let category of categories) {
        if(category.pointsPossible == 0) category.grade = CATEGORY_NOT_GRADED_STR;
        else category.grade = category.pointsEarned/category.pointsPossible;
    }
    return categories;
}
function calculateCategoryDetailsDisplay(period) {
    let categoriesWithDetails = calculateCategoryDetails(period);
    for(let category of categoriesWithDetails) {
        if(category.grade == CATEGORY_NOT_GRADED_STR) category.displayGrade = 'N/A';
        else category.displayGrade = (100*category.grade).toFixed(2) + '%';

        category.displayWeight = (100*category.weight) + '%';
    }
    return categoriesWithDetails;
}


/**
 * return assignment weight as decimal, errors out (and returns 1 to not break anything) if pointsPossible is not graded
 * 
 * if pointsEarned is not graded, this will calculate weight as if it was graded
 */
function calculateAssignmentWeight(period, assignmentInd) {
    if(period.assignments[assignmentInd].pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR) {
        console.error('calculateAssignmentWeight received assignment with pointsPossible = not graded');
        return 1;
    }

    let periodClone = _.cloneDeep(period);

    periodClone.assignments[assignmentInd].pointsEarned = 0;
    let gradeIf0 = calculateGrade(periodClone);

    periodClone.assignments[assignmentInd].pointsEarned = periodClone.assignments[assignmentInd].pointsPossible;
    let gradeIfFullScore = calculateGrade(periodClone);

    let weight = gradeIfFullScore - gradeIf0;
    return weight;
}
function calculateAssignmentWeightDisplay(period, assignmentInd) {
    if(period.assignments[assignmentInd].pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR) return 'N/A';
    else {
        let weight = calculateAssignmentWeight(period, assignmentInd);
        if(Number.isNaN(weight)) console.error('is NaN here');
        return (100*weight).toFixed(2) + '%';
    }
}


function calculateAssignmentGradeDisplay(assignment) {
    if(assignment.pointsEarned == NOT_GRADED_POINTS_EARNED_STR || assignment.pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR) {
        return 'N/A';
    }
    else {
        return (100*assignment.pointsEarned/assignment.pointsPossible).toFixed(2) + '%';
    }
}

function calculatePointsNeededDisplay(period, assignmentInd, grade) {
    if(period.assignments[assignmentInd].pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR) return 'N/A';

    //calculate by finding weight, then finding grade if you got a 0, then using these to find the points needed
    let weight = calculateAssignmentWeight(period, assignmentInd);

    let periodClone = _.cloneDeep(period);
    periodClone.assignments[assignmentInd].pointsEarned = 0;
    let gradeIf0 = calculateGrade(periodClone);

    let pointsNeeded = (grade - gradeIf0)/weight * period.assignments[assignmentInd].pointsPossible;

    return pointsNeeded.toFixed(2);
}

export {
    NOT_GRADED_POINTS_EARNED_STR,
    NOT_GRADED_POINTS_POSSIBLE_STR,
    CATEGORY_NOT_GRADED_STR,
    getAssignmentPointsEarnedDisplay,
    getAssignmentPointsPossibleDisplay,
    calculateGradeDisplay,
    calculateCategoryDetailsDisplay,
    calculateAssignmentWeightDisplay,
    calculateAssignmentGradeDisplay,
    calculatePointsNeededDisplay,
};
