import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet';
import titleLogo from './title-logo.svg';
import './login.css';

export default function LoginPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = (e) => {
        gtag('set', 'user_properties', {
            school_district: e.target.elements.urlSubdomain.value
        });
        gtag('event', 'login attempt');

        //resume default form action (I don't think this is needed actually, but whatever)
        return true;
    }

    return (
        <>
            <Helmet>
                <title>Mosachi - Login</title>
            </Helmet>
            <div className='login-page-container'>
                <div className='login-container'>
                    <div className='login-title-wrapper'>
                        <img className='login-title-img' src={titleLogo}></img>
                    </div>
                    <div className='login-body'>
                        <p className='text-muted'>Login with your StudentVUE credentials</p>

                        {searchParams.get('loginFailed')
                            ? <p className='login-failed-text text-danger'>That username or password is incorrect</p>
                            : null}
                        
                        <Form onSubmit={handleSubmit} action='/login' method='POST'>
                            <Form.Group className='mb-3' controlId='loginFormUsername'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control name='username' type='text' />
                            </Form.Group>
                            <Form.Group className='mb-3' controlId='loginFormPassword'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control name='password' type='password' />
                            </Form.Group>
                            <small className='login-form-text text-muted'>We won't store your credentials</small>
                            <br />
                            <Form.Group className='mb-3' controlId='loginFormSchoolDistrict'>
                                <Form.Label>School District</Form.Label>
                                <Form.Select name='urlSubdomain' defaultValue='wa-bsd405-psv'>
                                    <option value='wa-bsd405-psv'>BSD</option>
                                    <option value='wa-nor-psv'>NSD</option>
                                    <option value='ca-egusd-psv'>EGUSD</option>
                                </Form.Select>
                            </Form.Group>
                            <br />
                            <Button type='submit' variant='primary'>Log in</Button>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}