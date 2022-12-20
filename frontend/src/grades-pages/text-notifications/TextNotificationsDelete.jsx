import React, {useEffect, useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';

export default function TextNotificationsDelete(props) {
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [urlSubdomain, setUrlSubdomain] = useState('wa-bsd405-psv');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/text-notifications/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
                urlSubdomain: urlSubdomain,
            }),
        }).then((res) => res.json()).then((res) => {
            console.log(res);
            setDeleteSuccess(res);
            setShow1(false);
            setShow2(true);
        });
    };
    const showClick = () => {
        setShow1(true);
    };
    const closeClick1 = () => {
        setShow1(false);
    };
    const closeClick2 = () => {
        setShow2(false);
    };

    return (
        <>
            <a className="tn-modal-link" onClick={showClick}>
                Delete text notifications account
            </a>
            <Modal show={show1} onHide={closeClick1} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='tn-modal-title'>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body className='tn-modal1-body'>
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
                        <br />
                        <Button type='submit' variant='danger'>Delete account</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={show2} onHide={closeClick2} centered>
                <Modal.Header closeButton>
                    <Modal.Title className='tn-modal-title'>Delete Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deleteSuccess
                        ? <p>
                            Your account has been deleted. You should no longer receive any text notifications.
                            If you still do, please contact us at dumplinglife7584@gmail.com us so we can manually delete your account.
                        </p>
                        : <p>
                            We couldn't find your account; it is either already deleted or something has gone wrong.
                            If you are still receiving text notifications and are sure you entered your information correctly,
                            please contact us at dumplinglife7584@gmail.com us so we can manually delete your account.
                        </p>}
                </Modal.Body>
            </Modal>
        </>
    );
}