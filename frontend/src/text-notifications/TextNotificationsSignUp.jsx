import React, {useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';
import screenshot from './text-notifications-screenshot.png';

/*
export default function TextNotificationsSignUp(props) {
    const [activeModal, setActiveModal] = useState(-1);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [urlSubdomain, setUrlSubdomain] = useState('wa-bsd405-psv');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mmsEmailGateway, setMmsEmailGateway] = useState('mms.att.net');

    const showClick = () => {
        setActiveModal(0);
    };
    const hideModals = () => {
        setActiveModal(-1);
    };
    const nextModal = () => {
        setActiveModal(activeModal + 1);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/text-notifications/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                urlSubdomain: urlSubdomain,
                phoneNumber: phoneNumber,
                mmsEmailGateway: mmsEmailGateway,
            }),
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            nextModal();
        });
    };

    return (
        <>
            <a className="tn-modal-link" onClick={showClick}>
                Sign up for text notifications
            </a>
            <Modal show={activeModal == 0} onHide={hideModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='tn-modal-title'>Text Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        With Mosachi text notifications, we will alert you of any new assignments or score updates right after they go in.
                        By default, we will not send any scores over text for your privacy.
                    </p>
                    <div className='tn-screenshot-container'>
                        <img className='tn-screenshot' src={screenshot} />
                    </div>
                    <div className='tn-modal1-button-container'>
                        <Button variant='primary' onClick={nextModal}>Continue</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={activeModal == 1} onHide={hideModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='tn-modal-title'>Text Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => {handleSubmit(e)}}>
                        <Form.Group className='mb-3' controlId='tnUsername'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control name='username' type='text' value={username} onChange={(e) => {setUsername(e.target.value)}} />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='tnPassword'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control name='password' type='password' value={password} onChange={(e) => {setPassword(e.target.value)}} />
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='tnSchoolDistrict'>
                            <Form.Label>School District</Form.Label>
                            <Form.Select name='urlSubdomain' value={urlSubdomain} onChange={(e) => {setUrlSubdomain(e.target.value)}}>
                                <option value='wa-bsd405-psv'>BSD</option>
                                <option value='wa-nor-psv'>NSD</option>
                                <option value='ca-egusd-psv'>EGUSD</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='tnPhoneNumber'>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control name='phoneNumber' type='tel' value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}}
                                placeholder='1234567890' pattern='[0-9]{10}' required />
                            <small className='form-text text-muted'>Please enter a 10 digit phone number without dashes or spaces</small>
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='tnPhoneCarrier'>
                            <Form.Label>Phone Carrier</Form.Label>
                            <Form.Select name='mmsEmailGateway' value={mmsEmailGateway} onChange={(e) => {setMmsEmailGateway(e.target.value)}}>
                                <option value='mms.att.net'>AT&T</option>
                                <option value='tmomail.net'>T-Mobile</option>
                                <option value='vzwpix.com'>Verizon Wireless</option>
                                <option value='mypixmessages.com'>Xfinity Mobile</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='mb-3' controlId='tnTerms'>
                            <Form.Check
                                type='checkbox'
                                label='I allow Mosachi to store and periodically access my credentials, gradebook data, and other neccessary data
                                    to provide notifications about gradebook udpates.'
                            />
                        </Form.Group>
                        <br />
                        <Button type='submit' variant='primary'>Sign up</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={activeModal == 2} onHide={hideModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='assignment-details-title'>Text Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You are successfully signed up for Mosachi text notifications!
                        To stop receiving texts, delete your text notifications account, or contact us at mosachiofficial@gmail.com if you are having problems.
                    </p>
                </Modal.Body>
            </Modal>
        </>
    );
}
*/

export default function TextNotificationsSignUp(props) {
    const [activeModal, setActiveModal] = useState(-1);
    const showClick = () => {
        setActiveModal(0);
    };
    const hideModals = () => {
        setActiveModal(-1);
    };

    return (
        <>
            <a className="tn-modal-link" onClick={showClick}>
                Sign up for text notifications
            </a>
            <Modal show={activeModal == 0} onHide={hideModals} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='tn-modal-title'>Text Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Text notifications are currently down. Please check again later.
                    </p>
                </Modal.Body>
            </Modal>
        </>
    );
}