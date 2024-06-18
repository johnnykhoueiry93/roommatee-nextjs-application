/**
 * Usage
 * In another component
 * import InfoPopup from "../modals/InfoPopup";
 * const [showInfoPopup, setShowInfoPopup] = useState(false);
 * const [popupMessage, setPopupMessage] = useState('');
 * Call it in the HTML return <InfoPopup show={showInfoPopup} setShow={setShowInfoPopup} popupMessage={popupMessage}/>
 */


import Modal from "react-bootstrap/Modal";
import { SiteData } from "../../context/SiteWrapper";
import { useState } from "react";
import Box from '@mui/material/Box';

//@ts-ignore
const InfoPopup = ({show, setShow, popupMessage}) => {
    //@ts-ignore
    const { setSessionWarningShow, setUserAuth} = SiteData();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };

    const handleClose = () => {
        setShow(false);
      };

    const iconStyle = {
        fontSize: 60, // Adjust the size as needed
        color: "var(--roomatee-theme-color)", // Change the color to your desired color
      };


    return (
      //@ts-ignore
        <Modal size="md" show={show} onHide={handleClose}>
            <div className='p-4'>
                <p style={{textAlign: 'center'}}>{popupMessage}</p>
            </div>
        </Modal>
      );
}

export default InfoPopup;