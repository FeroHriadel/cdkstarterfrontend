import React from 'react';
import { Modal, Button } from 'react-bootstrap';



export default function ConfirmModal(props: any) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton />
          
        <Modal.Body className='text-center'>
          <h5>Are you sure?</h5>
          <p>Please confirm</p>

          <br />

          <div className='d-flex justify-content-center'>
          <Button onClick={props.onHide} className='col-5 m-1'>Close</Button>
          <Button onClick={() => {props.setActionConfirmed(true); props.onHide()}} className='col-5 m-1'>Confirm</Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }