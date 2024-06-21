import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import TextField from '@mui/material/TextField';
import { SiteData } from "../../context/SiteWrapper";
// import BackendAxios from "../../backend/BackendAxios";
import StaticFrontendLabel from "../../StaticFrontend";
//@ts-ignore
function ReportUser(props) {

    //@ts-ignore
    const { userInfo, snackbarOpen, setSnackbarOpen, snackbarMessage, setSnackbarMessage, snackbarSeverity, setSnackbarSeverity} = SiteData();

    const initialReportData = {
        emailAddress: userInfo.emailAddress,
        reportReason: "",
        description: "",
        reporter: userInfo.id,
        reportee: props.reportee,
        conversationId: props.conversationId,
    }

    const [reportData, setReportData] = useState({
        emailAddress: userInfo.emailAddress,
        reportReason: "",
        description: "",
        reporter: userInfo.id,
        reportee: props.reportee,
        conversationId: props.conversationId,
      });


   //@ts-ignore
   const handleSendTicketReply = async () => {
    console.log('Logging the object reportData: ' , reportData)

    // try {
    //   const response = await BackendAxios.post("/reportUserChat", reportData);
    //   setSnackbarMessage(StaticFrontendLabel.CHAT_REPORT_USER_SUCCESS_MESSAGE);
    //   setSnackbarSeverity("success");
    //   setSnackbarOpen(true);
    //   //@ts-ignore
    // } catch (error) {
    //   // @ts-ignore
    //   console.error("Reporting the user: " + error.message);
    // }
  };

  const handleReportUserChat = async () => {
    // Add logic to handle reporting the user with the reportReason value
    setReportData((prevData) => ({
        ...prevData,
        reporter: userInfo.id,
      }));

    handleSendTicketReply();

    // this is VERY important otheriwise the next time (wihtin the same session)
    // they try to report a user it will report without filling the info
    // this will actually reset after the submit
    setReportData(initialReportData);

    props.onHide(); // Close the modal after reporting
  };

  function returnDescriptionInputField() {
    const remainingBioCharacters = 300 - reportData.description.length;
    return (
      <div className="mt-3">
        <label className="remaining-characters-style pb-2">
          Remaining Characters: {remainingBioCharacters}
        </label>
        <TextField
          sx={{ width: "100%" }}
          inputProps={{ maxLength: "300" }}
          id="outlined-textarea"
          label="Additional Info"
          placeholder="Please provide additional details about your issue if necessary."
          multiline
          rows={4}
          onChange={(event) => setReportData((prevData) => ({
            ...prevData,
            description: event.target.value,
          }))}
        />
      </div>
    );
  }

  function returnReportReasonInput() {
    return (
      <>
        <div className="">
          <div>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Reason
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Reason"
                //@ts-ignore
                onChange={(event) => setReportData((prevData) => ({
                    ...prevData,
                    reportReason: event.target.value,
                  }))}
              >
                <MenuItem value={"Harassment or bullying"}>Harassment or bullying</MenuItem>
                <MenuItem value={"Hate speech"}>Hate speech</MenuItem>
                <MenuItem value={"Spam or fake account"}>Spam or fake account</MenuItem>
                <MenuItem value={"Graphic or violent content"}>Graphic or violent content</MenuItem>
                <MenuItem value={"Promoting illegal activities or substances"}>Promoting illegal activities or substances</MenuItem>
                <MenuItem value={"Engaging in cyberbullying or trolling"}>Engaging in cyberbullying or trolling</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </>
    );
  }

  function retrunAllFieldsCompleted() {
    let isAllFieldsCompleted = false;
    if(reportData.reportReason && reportData.description) {
        isAllFieldsCompleted = true;
    } 

    return isAllFieldsCompleted;
  }

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Report User
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {returnReportReasonInput()}
          {returnDescriptionInputField()}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" disabled={!retrunAllFieldsCompleted()} onClick={handleReportUserChat}>
          Report
        </Button>
        <Button onClick={props.onHide}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportUser;
