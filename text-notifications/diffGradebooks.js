const ASSIGNMENT_DIFF_TYPE_NEW_ASSIGNMENT = 'new assignment';
const ASSIGNMENT_DIFF_TYPE_POINTS_CHANGE = 'points change';

function diffGradebooks(oldGradebook, newGradebook) {
    //check that all periods are the same, otherwise skip
    if(oldGradebook.length != newGradebook.length) return [];
    for(let i=0; i<oldGradebook.length; i++) {
        if(oldGradebook[i].name != newGradebook[i].name) return [];
    }

    let res = [];
    for(let i=0; i<oldGradebook.length; i++) {
        let oldPeriod = oldGradebook[i];
        let newPeriod = newGradebook[i];
        
        res = res.concat(diffPeriods(oldPeriod, newPeriod));
    }
    return res;
}
function diffPeriods(oldPeriod, newPeriod) {
    if(hasDuplicateAssignmentIds(oldPeriod) || hasDuplicateAssignmentIds(newPeriod)) return [];

    let res = [];
    for(let newAssignment of newPeriod.assignments) {
        let matchingOldAssignment = null;
        for(let oldAssignment of oldPeriod.assignments) {
            if(oldAssignment.id == newAssignment.id) {
                matchingOldAssignment = oldAssignment;
                break;
            }
        }

        //if new assignment
        if(matchingOldAssignment == null) {
            res.push({
                diffType: ASSIGNMENT_DIFF_TYPE_NEW_ASSIGNMENT,
                newAssignment: newAssignment,
            });
        }
        //if points changed, add to res
        else if(newAssignment.pointsEarned != matchingOldAssignment.pointsEarned
                || newAssignment.pointsPossible != matchingOldAssignment.pointsPossible) {
            res.push({
                diffType: ASSIGNMENT_DIFF_TYPE_POINTS_CHANGE,
                newAssignment: newAssignment,
            });
        }
        //else do nothing
    }

    return res;
}
function hasDuplicateAssignmentIds(period) {
    for(let j=0; j<period.assignments.length; j++) {
        for(let k=j+1; k<period.assignments.length; k++) {
            if(period.assignments[j].id == period.assignments[k].id) return true;
        }
    }
    return false;
}

module.exports = {
    diffGradebooks: diffGradebooks,
    ASSIGNMENT_DIFF_TYPE_NEW_ASSIGNMENT: ASSIGNMENT_DIFF_TYPE_NEW_ASSIGNMENT,
    ASSIGNMENT_DIFF_TYPE_POINTS_CHANGE: ASSIGNMENT_DIFF_TYPE_POINTS_CHANGE,
};