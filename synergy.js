const axios = require('axios');
const parseString = require('xml2js').parseString;

const QUARTERS = {
    'wa-bsd405-psv': 3,
    'wa-nor-psv': 3,
    'ca-egusd-psv': 7,
}
const DEFAULT_QUARTER = 3;
//value of pointsEarned if assignment is not graded. Make sure this matches with front-end calculation/display code
const NOT_GRADED_STR = 'Not graded';
//name of single category if there are no categories
const NO_CATEGORY_CATEGORY_NAME = 'TOTAL';
const INVALID_CREDENTIALS_STR = 'Invalid credentials';


function getGradebook(username, password, urlSubdomain) {
    return axios.request({
        url: `https://${urlSubdomain}.edupoint.com/Service/PXPCommunication.asmx/ProcessWebServiceRequest`,
        method: 'post',
        data: {
            userID: username,
            password: password,
            skipLoginLog: 'true',
            parent: 'false',
            webServiceHandleName: 'PXPWebServices',
            methodName: 'Gradebook',
            paramStr: `<Parms><ChildIntID>0</ChildIntID><ReportPeriod>${QUARTERS[urlSubdomain] ?? DEFAULT_QUARTER}</ReportPeriod></Parms>`
        }
    }).then((res) => {       
        //parseString uses callback for backward-compatability, so this code is weird (periods being outside and modified inside callback)
        let invalidCredetials = false;
        let periods = [];

        parseString(res.data.d, function(err, resJSON) {
            if(resJSON.hasOwnProperty('RT_ERROR')) {
                invalidCredetials = true;
            }
            else {
                /**
                 * try/catch cases:
                 *  - getPeriod does not work, then skip the period but continue with the rest
                 *  - periodsSrc is undefined, then fallback to login failed
                 *  - something else, then check if periods makes sense, return it if it does, otherwise fallback to login failed
                 */
                try {
                    let periodsSrc = resJSON.Gradebook.Courses[0].Course;
                    for(let periodSrc of periodsSrc) {
                        try {
                            periods.push(getPeriod(periodSrc));
                        } catch(error) {
                            //if error, skip this period, continue with the other stuff
                            console.error(error);
                        }
                    }
                } catch(error) {
                    //if error, crudely check if periods makes sense, if it does, return it, otherwise return login failed
                    console.error(error);
                    console.log('----');
                    console.log(resJSON.Gradebook.Courses[0].Course);

                    if(periods.length > 0 && periods[0].hasOwnProperty('name')) {
                        //do nothing
                    }
                    else invalidCredetials = true;
                }
            }
        });
        if(invalidCredetials) return INVALID_CREDENTIALS_STR;
        else return periods;
    }).catch((error) => {
        //only cause I can think of is urlSubdomain doesn't exist, but apparently there are other issues
        //fallback to returning login failed
        console.error(error);
        console.log(`urlSubdomain: ${urlSubdomain}`);
        return INVALID_CREDENTIALS_STR;
    });
}

/**
 * Get name, categories, and assignments
 * Special cases:
 * If period has no categories, there will be 1 category with name NO_CATEGORY_CATEGORY_NAME and weight 1
 * If some assignment has a category that is not a real category, a 0-weight category of the same name will be created
 *   (i.e. this ensures every assignment will have a category)
 */
function getPeriod(periodSrc) {
    let period = {};

    //NAME
    //Title is given as as "Foundations of Fitness (PE_401.1)", this deletes the (...)
    period.name = periodSrc.$.Title.replace(/ \([\s\S]*?\)/g,'');

    //CATEGORIES AND ASSIGNMENTS
    period.assignments = [];
    let assignmentsSrc = periodSrc.Marks[0].Mark[0].Assignments[0].Assignment;
    //if undefined, null, or empty string, set it to empty array
    //... == null also checks for undefined
    if(assignmentsSrc == null || assignmentsSrc == '') assignmentsSrc = [];

    //regular case
    if(periodSrc.Marks[0].Mark[0].GradeCalculationSummary[0].hasOwnProperty('AssignmentGradeCalc')) {
        let categoriesSrc = periodSrc.Marks[0].Mark[0].GradeCalculationSummary[0].AssignmentGradeCalc;
        period.categories = getCategories(categoriesSrc);
        for(let assignmentSrc of assignmentsSrc) {
            period.assignments.push(getAssignmentWithCategoryFilling(assignmentSrc, period.categories));
        }
    }
    //no categories
    else {
        period.categories = [
            {
                name: NO_CATEGORY_CATEGORY_NAME,
                weight: 1,
            },
        ];
        //get assignments, use custom category
        for(let assignmentSrc of assignmentsSrc) {
            let assignment = getAssignmentWithoutCategory(assignmentSrc, period.categories);
            assignment.category = 0;
            period.assignments.push(assignment);
        }
    }

    return period;
}

function getCategories(categoriesSrc) {
    let categories = [];
    for(let categorySrc of categoriesSrc) {
        if(categorySrc.$.Type == 'TOTAL') continue;
        else {
            categories.push({
                name: categorySrc.$.Type,
                weight: parseFloat(categorySrc.$.Weight)/100,
            });
        }
    }
    return categories;
}

/**
 * get full assignment (name, category, pointsEarned, pointsPossible)
 * category filling: if assignment has new category, add a new 0-weight category to categories
 */
function getAssignmentWithCategoryFilling(assignmentSrc, categories) {
    let assignment = getAssignmentWithoutCategory(assignmentSrc);

    //CATEGORY
    let categoryName = assignmentSrc.$.Type;
    let categoryIndex = findCategoryIndexByName(categoryName, categories);
    //add category if not found, with 0 weight
    if(categoryIndex == -1) {
        categories.push({
            name: categoryName,
            weight: 0,
        });
        categoryIndex = categories.length - 1;
    }
    assignment.category = categoryIndex;

    return assignment;
}


//get id, name, pointsEarned, and pointsPossible
function getAssignmentWithoutCategory(assignmentSrc) {
    let assignment = {};
    assignment.id = assignmentSrc.$.GradebookID;
    assignment.name = assignmentSrc.$.Measure;

    //pointsEarned and pointsPossible
    let pointsStr = assignmentSrc.$.Points; //"33.00 / 33.0000"
    if(pointsStr.includes('/')) {
        let pointsStrSplit = pointsStr.split('/');
        assignment.pointsEarned = parseFloat(pointsStrSplit[0]);
        assignment.pointsPossible = parseFloat(pointsStrSplit[1]);
    }
    else {
        assignment.pointsEarned = NOT_GRADED_STR;
        assignment.pointsPossible = parseFloat(pointsStr);
    }

    return assignment;
}

//helper function to help handle special cases
function findCategoryIndexByName(categoryName, categories) {
    let index;
    let numMatches = 0;
    for(let i=0; i<categories.length; i++) {
        if(categories[i].name == categoryName) {
            index = i;
            numMatches++;
        }
    }

    if(numMatches == 0) return -1;
    else if(numMatches == 1) return index;
    if(numMatches >= 2) {
        //this happens if categories have duplicate names, which shouldn't happen unless the teacher sets that up
        //If the teacher sets that up, it would cause everything else to bug anyways because we use name as identifier
       throw `multiple category matches: ${categoryName}, ${categories}`;
    }
}

module.exports = {
    getGradebook: getGradebook,
    INVALID_CREDENTIALS_STR: INVALID_CREDENTIALS_STR,
};
