import "../../styles/userProfileWorkflow/NavigationButton.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//@ts-ignore
const NavigationButton = ({ direction, nextStep, prevStep }) => {
  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const iconStyle = {
    fontSize: 50, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  return (
    <div className='pt-4'>
      {direction === "Next" && (
        <div onClick={handleNext} className="navigation-btn-style">
          <span className="arrow-label">Next</span>{" "}
          <ArrowForwardIosIcon style={iconStyle} className='shake' />
        </div>
      )}

      {direction === "Back" && (
        <div onClick={handlePrev} className="navigation-btn-style">
          <ArrowBackIosNewIcon style={iconStyle} />{" "}
          <span className="arrow-label">Back</span>
        </div>
      )}

      {direction === "Finish" && (
        <div onClick={handleNext} className="navigation-btn-style">
          <CheckCircleIcon style={iconStyle} />{" "}
          <span className="arrow-label">Finish</span>
        </div>
      )}
    </div>
  );
};

export default NavigationButton;
