import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import _ from 'lodash';
import {
    NOT_GRADED_POINTS_EARNED_STR,
    NOT_GRADED_POINTS_POSSIBLE_STR,
    getAssignmentPointsEarnedDisplay,
    getAssignmentPointsPossibleDisplay,
    calculateAssignmentWeightDisplay,
    calculateAssignmentGradeDisplay,
    calculatePointsNeededDisplay,
} from './gradeCalc.js';

/**
 * props: period and setPeriod
 * returns the assignment grid and Add Assignment button
 * also has the more info pop-up
 */
export default function AssignmentGrid(props) {
    const [popupState, setPopupState] = useState({
        assignmentInd: -1,
        show: false,
    });

    /**
     * helper function for AssignmentRow onChange handler
     * Params: assignmentInd and a callback describing the change. It updates state to reflect the change
     * it clones period so that setState works correctly. 
     */
     const changeAssignment = (assignmentInd, callback) => {
        let periodClone = _.cloneDeep(props.period);
        callback(periodClone.assignments[assignmentInd]);
        props.setPeriod(periodClone);
    }

    let assignmentRows = [];
    for(let i=0; i<props.period.assignments.length; i++) {
        let assignment = props.period.assignments[i];

        /**
         * key: using index for key. Some sort of id would be better, but it's harder to add. name won't work because of duplicate names
         * form onChange handlers: use changeAssignment helper function to correctly set state (with cloning then mutate)
         */
        assignmentRows.push(<AssignmentRow
            key={assignment.id}
            assignment={assignment}
            categories={props.period.categories}
            setName={(name) => {changeAssignment(i, (assignment) => {assignment.name = name})}}
            setCategory={(category) => {changeAssignment(i, (assignment) => {assignment.category = category})}}
            setPointsEarned={(pointsEarned) => {changeAssignment(i, (assignment) => {assignment.pointsEarned = pointsEarned})}}
            setPointsPossible={(pointsPossible) => {changeAssignment(i, (assignment) => {assignment.pointsPossible = pointsPossible})}}
            showPopup={() => {
                setPopupState({
                    assignmentInd: i,
                    show: true,
                });
            }}
        />);
    }

    return (
        <div className='assignment-grid-container'>
            <button className='add-assignment-button btn btn-outline-secondary' onClick={() => {
                let periodClone = _.cloneDeep(props.period);
                let newAssignment = {
                    id: _.uniqueId(),
                    name: 'New Assignment',
                    category: 0,
                    pointsEarned: NOT_GRADED_POINTS_EARNED_STR,
                    pointsPossible: NOT_GRADED_POINTS_POSSIBLE_STR,
                }
                periodClone.assignments.unshift(newAssignment);
                props.setPeriod(periodClone);
            }}>
                <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;&nbsp;Add Assignment
            </button>
            <div className='assignment-grid'>
                <div className='assignment-row assignment-grid-header row'>
                    <div className='assignment-col col'>Name</div>
                    <div className='assignment-col col'>Category</div>
                    <div className='assignment-col col'>Points Earned</div>
                    <div className='assignment-col col'>Points Possible</div>
                    <div className='assignment-col assignment-details-button-col col'></div>
                </div>
                {assignmentRows}
            </div>

            <AssignmentPopup
                period={props.period}
                assignmentInd={popupState.assignmentInd}
                deleteAssignment={() => {
                    let periodClone = _.cloneDeep(props.period);
                    periodClone.assignments.splice(popupState.assignmentInd, 1);
                    props.setPeriod(periodClone);
                }}
                show={popupState.show}
                handleClose={() => {
                    let popupStateClone = _.cloneDeep(popupState);
                    popupStateClone.show = false;
                    setPopupState(popupStateClone);
                }}
            />
        </div>
    );
}

//props: categories (for category dropdown), assignment, and form onChange handlers, function to show popup
function AssignmentRow(props) {
    let categoryDropdownOptions = [];
    for(let i=0; i<props.categories.length; i++) {
        categoryDropdownOptions.push(<option key={i} value={i}>{props.categories[i].name}</option>);
    }

    const [pointsEarnedInputStr, setPointsEarnedInputStr]
        = useState(props.assignment.pointsEarned == NOT_GRADED_POINTS_EARNED_STR ? '' : props.assignment.pointsEarned);
    const [pointsPossibleInputStr, setPointsPossibleInputStr]
        = useState(props.assignment.pointsPossible == NOT_GRADED_POINTS_POSSIBLE_STR ? '' : props.assignment.pointsPossible);

    return (
        <div className='assignment-row row'>
            <div className='assignment-col col'>
                <Form.Control
                    type='text'
                    value={props.assignment.name}
                    onChange={(e) => {props.setName(e.target.value)}}
                    placeholder='Untitled Assignment'
                />
            </div>
            <div className='assignment-col col'>
                <Form.Select value={props.assignment.category} onChange={(e) => {props.setCategory(e.target.value)}}>
                    {categoryDropdownOptions}
                </Form.Select>
            </div>
            <div className='assignment-col col'>
                <Form.Control
                    type='number'
                    value={pointsEarnedInputStr}
                    onChange={(e) => {
                        setPointsEarnedInputStr(e.target.value);
                        if(Number.isNaN(e.target.valueAsNumber)) props.setPointsEarned(NOT_GRADED_POINTS_EARNED_STR);
                        else props.setPointsEarned(e.target.valueAsNumber);
                    }}
                    placeholder='Not Graded'
                />
            </div>
            <div className='assignment-col col'>
                <Form.Control
                    type='number'
                    value={pointsPossibleInputStr}
                    onChange={(e) => {
                        setPointsPossibleInputStr(e.target.value);
                        if(Number.isNaN(e.target.valueAsNumber)) props.setPointsPossible(NOT_GRADED_POINTS_POSSIBLE_STR);
                        else props.setPointsPossible(e.target.valueAsNumber);
                    }}
                    placeholder='Not Graded'
                />
            </div>
            <div className='assignment-col assignment-details-button-col col'>
                <Button className='assignment-details-button' variant='outline-secondary' onClick={props.showPopup}>
                    <i className='fa-solid fa-info'></i>
                </Button>
            </div>
        </div>
    );
}

//props: period, assignmentInd, deleteAssignment,  show (whether to show this), handleClose
function AssignmentPopup(props) {
    const [inputGrade, setInputGrade] = useState(90);

    if(props.assignmentInd == -1) return null;

    //calculate assignment details
    let assignment = props.period.assignments[props.assignmentInd];
    let pointsEarned = getAssignmentPointsEarnedDisplay(assignment);
    let pointsPossible = getAssignmentPointsPossibleDisplay(assignment);

    let grade = calculateAssignmentGradeDisplay(assignment);

    let weight = calculateAssignmentWeightDisplay(props.period, props.assignmentInd);

    //calculate points needed
    let pointsNeeded;
    if(Number.isNaN(parseFloat(inputGrade))) pointsNeeded = '';
    else pointsNeeded = calculatePointsNeededDisplay(props.period, props.assignmentInd, parseFloat(inputGrade)/100);

    return (
        <Modal show={props.show} onHide={props.handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className='assignment-details-title'>Assignment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <b>Name: </b>{assignment.name}
                </div>
                <div>
                    <b>Category: </b>{props.period.categories[assignment.category].name}
                </div>
                <div>
                    <b>Points: </b>{`${pointsEarned} / ${pointsPossible}`}
                </div>
                <div>
                    <b>Grade: </b>{grade}
                </div>
                <div>
                    <b>Weight: </b>{weight}
                </div>
            </Modal.Body>
            <Modal.Body className='assignment-points-needed-container'>
                <div className='assignment-points-needed-row row'>
                    <div className='col-md-auto'>
                        <span>What score do I need to have a </span>
                        <Form.Control className='assignment-points-needed-input' type='number' value={inputGrade} onChange={(e) => {
                            setInputGrade(e.target.value);
                        }} />
                        <span>%</span>
                    </div>
                    <div className='assignment-points-needed-result col'>
                        {pointsNeeded}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => {
                    props.handleClose();
                    props.deleteAssignment();
                }}>Delete</Button>
                <Button variant="secondary" onClick={props.handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}