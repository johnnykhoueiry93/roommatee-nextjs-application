import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import ListingType from "../Listings/ListingType";
import React from "react";
import '../../styles/Modal.css'

// @ts-ignore
function SelectListingType(props) {
  return (
    <Modal
      {...props}
      size="lg"
      // aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      {/* <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select a listing type
        </Modal.Title>
      </Modal.Header> */}
      <Modal.Body>

        {/* <ListingType/> */}

      </Modal.Body>
      {/* <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer> */}
    </Modal>
  );
}

export default SelectListingType;
