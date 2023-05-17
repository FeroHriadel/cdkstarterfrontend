import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { sendPasswordResetEmail, sendCodeAndNewPassword } from '../actions/amplifyActions';



const ForgotPasswordPage = () => {
  //VALUES
  const [name, setName] = useState('emaletester0');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('?9ZzContrasenaA1!');
  const [formDisabled, setFormDisabled] = useState(false);
  const [resetFormDisabeld, setResetFormDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);



  //METHODS
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setFormDisabled(true);
    const result = await sendPasswordResetEmail(name);
    if (result.error) { setMessage(JSON.stringify(result.error)); setFormDisabled(false); setTimeout(() => {setMessage('')}, 2000) }
    else {
      setMessage('We sent you an email. Please enter the code from the email and your new password below:');
      setShowResetForm(true);
    }
  }

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setResetFormDisabled(true);
    const result = await sendCodeAndNewPassword(name, code, newPassword);
    if (result.error) { setMessage(JSON.stringify(result.error)); setResetFormDisabled(false); }
    else setMessage('Your password has been changed');
  }



  //RENDER
  return (
    <div className='container'>
      <h1 className='text-center'>Forgot Password Page</h1>

      <br /><br /><br />

      <h5 className='mb-3 text-center'>PLEASE ENTER YOUR USERNAME</h5>

      <main className='row'>
        <div className='col-md-6 offset-md-3'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                  type="text" 
                  placeholder="Enter your username"
                  value={name}
                  name='email'
                  onChange={(e) => {setName(e.target.value)}}
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

          {
            showResetForm
            &&
            <Form onSubmit={handlePasswordReset}>
              <Form.Group className='mb-3' controlId='formCode'>
                <Form.Label>Code</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder='code'
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  disabled={resetFormDisabeld}
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formPassword'>
                <Form.Label>New Password</Form.Label>
                <Form.Control 
                  type="password"
                  placeholder='new password'
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={resetFormDisabeld}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className='col-12' disabled={resetFormDisabeld}>
                  Set New Password
              </Button>
            </Form>
          }
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage