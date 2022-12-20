import React, { useState, useEffect, useRef } from 'react';
import Period from '../grades-pages/Period.jsx';
import titleLogoWhite from '../title-logo-white.svg';
import './landing.css';

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

export default function LandingPage(props) {
    const [loginButtonClass, setLoginButtonClass] = useState('top-right-login-button-outline');
    const loginButtonWrapperEle = useRef(null);
    useEffect(() => {
        const onScroll = () => {
            if(loginButtonWrapperEle.current.getBoundingClientRect().top + window.pageYOffset < window.innerHeight) {
                setLoginButtonClass('top-right-login-button-outline');
            }
            else {
                setLoginButtonClass('top-right-login-button-solid');
            }
        };
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll)
        };
    }, []);

    return (
        <>
            <div className="top-right-login-wrapper" ref={loginButtonWrapperEle}>
                <a className={`top-right-login-button btn ${loginButtonClass}`} href="/login">Login</a>
            </div>
            <div className="title-section">
                <div className="title-section-text-container">
                    <div className="title-section-text-wrapper">
                        <div className="title-section-title-wrapper">
                            <img className="title-section-title-img" src={titleLogoWhite} />
                        </div>
                        <h3 className="title-section-description">The gradebook calculator for Synergy</h3>
                        <a className="title-section-login-button btn" href="/login">Log in</a>
                    </div>
                </div>
                <div className="title-section-image-wrapper">
                    <div className="iphone-image"></div>
                </div>
            </div>
            <div className="demo-section">
                <Period period={demoPeriod} demo={true} />
            </div>
            <div className="about-section">
                <p className="about-header display-2">About</p>
                <div className="about-row">
                    <div className="about-col col">
                        <div className="about-icon-wrapper">
                            <i className="about-icon fa-solid fa-right-to-bracket"></i>
                        </div>
                        <h2 className="about-title">Login</h2>
                        <p>No sign up needed. Simply login with your Synergy credentials so that we can fetch your grades.</p>
                    </div>
                    <div className="about-col col">
                        <div className="about-icon-wrapper">
                            <i className="about-icon fa-solid fa-list"></i>
                        </div>
                        <h2 className="about-title">Class List</h2>
                        <p>Right when you log in to Mosachi, you get a centralized, clutter-free view of all your classNamees. Refreshing.</p>
                    </div>
                    <div className="about-col col">
                        <div className="about-icon-wrapper">
                            <i className="about-icon fa-solid fa-calculator"></i>
                        </div>
                        <h2 className="about-title">Calculate</h2>
                        <p>Make a change to any assignment and see how it impacts your grade.</p>
                    </div>
                </div>
            </div>
        </>
    );
}