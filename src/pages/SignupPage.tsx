import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { Form, Button } from 'react-bootstrap';
import CognitoCodeForm from '../components/forms/CognitoCodeForm';
import { signup, resendConfirmationCode, confirmSignup } from '../actions/amplifyActions';
import VisitorsOnly from '../components/routeGuards/VisitorsOnly';




const SignupPage = () => {
    //VALUES
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [signupFormValues, setSignupFormValues] = useState({name: 'emaletester0', email: 'emaletester0@gmail.com', password: '?9ZzContrasenaA1!'});
    const { name, email, password} = signupFormValues;
    const [code, setCode] = useState('');
    const [showCodeForm, setShowCodeForm] = useState(false);
    const [signupFormDisabled, setSignupFormDisabled] = useState(false);
    const [message, setMessage ] = useState('');



    //METHODS
    const handleSignupInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage('');
        setSignupFormValues({...signupFormValues, [e.target.name]: e.target.value})
    }

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setSignupFormDisabled(true); setMessage('Signing up...');
        let result = await signup(name, email, password);
        if (result.error) {
            let errorString = JSON.stringify(result.error);
            if (errorString.includes('UsernameExistsException')) {
                let result = await resendConfirmationCode(name);
                if (result.error) { setMessage('Something went wrong. Please try again'); setSignupFormDisabled(false); }
                else { setMessage('We sent you an email with a verification code'); setShowCodeForm(true); }
            } else {
                setMessage(errorString);
                setSignupFormDisabled(false);
            }
        }
        else { setMessage('We sent you an email with a verification code'); setShowCodeForm(true); }
    }


    const confirmCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let result = await confirmSignup(name, code);
        if (!result.error) { setMessage('Thank you for signing up! You may now sign in :). Redirecting...'); setShowCodeForm(false); setTimeout(() => {navigate('/signin')}, 2000); }
        else setMessage('Sorry, something went wrong. Try again, please.');
    }



    //RENDER
    return (
        <div className='container'>

            <VisitorsOnly />

            <h1 className='text-center'>Signup Page</h1>

            <br /><br /><br />

            <h5 className='mb-3 text-center'>PLEASE ENTER YOUR CREDENTIALS</h5>

            <main className='row'>
                <div className='col-md-6 offset-md-3'>
                    <Form onSubmit={handleSignup}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter name"
                                value={name}
                                name='name'
                                onChange={handleSignupInput}
                                disabled={signupFormDisabled}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter email"
                                value={email}
                                name='email'
                                onChange={handleSignupInput}
                                disabled={signupFormDisabled}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter password"
                                value={password}
                                name='password'
                                onChange={handleSignupInput}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='col-12' disabled={signupFormDisabled}>
                            Sign up
                        </Button>
                    </Form>

                    <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <p className='text-center message'>{message}</p>
                    </div>
                   
                    { showCodeForm && <CognitoCodeForm code={code} setCode={setCode} confirmCode={confirmCode} />}

                    <div style={{display: 'flex', height: '3rem', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <Link to='/signin'>
                            <p className='text-center text-info'>Already have an account?</p>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SignupPage