import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

// @ts-ignore
function DeleteListing(props) {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Are you sure you want to delete this listing?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
        <Button className="btn btn-danger" onClick={() => {props.deleteRoomListing(props.listingItem.id); console.log('The user clicked on Yes to delete'); props.onHide();}}>Yes</Button>
          <Button onClick={props.onHide}>No</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  
  export default DeleteListing;
