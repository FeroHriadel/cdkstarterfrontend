import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { login as cognitoLogin } from '../actions/amplifyActions';
import { saveUserAndToken } from '../helpers/cookie';
import VisitorsOnly from '../components/routeGuards/VisitorsOnly';



const SigninPage = () => {
    //VALUES
    const navigate = useNavigate();
    const { user, login: userContextLogin } = useContext(UserContext);
    const [signinFormValues, setSigninFormValues] = useState({name: 'emaletester0', password: '?9ZzContrasenaA1!'});
    const { name, password} = signinFormValues;
    const [formDisabled, setFormDisabled] = useState(false);
    const [message, setMessage] = useState('');



    //METHODS
    const handleSigninInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage('');
        setSigninFormValues({...signinFormValues, [e.target.name]: e.target.value})
    }

    const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); setFormDisabled(true);
        const result = await cognitoLogin(name, password);
        if (result.error) { setMessage(JSON.stringify(result.error)); setFormDisabled(false); }
        else {
            let email = result.attributes.email;
            let role = result.signInUserSession.accessToken.payload[`cognito:groups`]?.length > 0 ? 'admins' : '';
            let token = result.signInUserSession.idToken.jwtToken;
            userContextLogin({ user: { username: name, email, role}, token });
            saveUserAndToken({username: name, email, role}, token);
            setMessage('Signed in. Redirecting...'); setTimeout(() => {navigate('/')}, 2000);
        }
    }



    //RENDER
    return (
        <div className='container'>

            <VisitorsOnly />

            <h1 className='text-center'>Signin Page</h1>

            <br /><br /><br />

            <h5 className='mb-3 text-center'>PLEASE ENTER YOUR CREDENTIALS</h5>

            <main className='row'>
                <div className='col-md-6 offset-md-3'>
                    <Form onSubmit={handleSignin}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter name"
                                value={name}
                                name='name'
                                onChange={handleSigninInput}
                                disabled={formDisabled}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Enter password"
                                value={password}
                                name='password'
                                onChange={handleSigninInput}
                                disabled={formDisabled}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className='col-12' disabled={formDisabled}>
                            Submit
                        </Button>
                    </Form>

                    <div style={{height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <p className='text-center message'>{message}</p>
                    </div>

                    <br />

                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                        <Link to='/forgotpassword'>
                            <p className='text-center text-info mb-2'>Forgot password?</p>
                        </Link>
                        
                        <Link to='/signup'>
                            <p className='text-center text-info'>Don't have an account?</p>
                        </Link>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default SigninPage