import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';



const CognitoCodeForm: React.FC<{ 
    code: string, 
    setCode: React.Dispatch<React.SetStateAction<string>>, 
    confirmCode: (e: React.FormEvent<HTMLFormElement>) => void }
    > = ({ 
        code, 
        setCode, 
        confirmCode 
    }) => {

    return (
        <React.Fragment>
            <p className='mb-3'>You received an email with a code. Please enter the code to complete the process.</p>
            <Form onSubmit={confirmCode}>
                <Row>
                    <Col>
                        <Form.Control value={code} placeholder='Code' onChange={(e) => {setCode(e.target.value)}} />
                    </Col>
                    <Col>
                        <Button variant="primary" type="submit">Confirm</Button>
                    </Col>
                </Row>
            </Form>
        </React.Fragment>
    )
}

export default CognitoCodeForm