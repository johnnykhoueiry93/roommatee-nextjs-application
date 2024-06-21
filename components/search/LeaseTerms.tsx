import { SiteData } from "../../context/SiteWrapper";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SectionHeading from "../modals/SectionTitle";

//@ts-ignore
const LeaseTerms = ({ selectedCardDetails }) => {
  //@ts-ignore
  const { isMobile } = SiteData();

  let iconSizeDisplay = "2rem";
  let fontSize = "18px";

  if (isMobile) {
    iconSizeDisplay = "2.1rem";
    fontSize = "15px";
  }

  const iconStyle = {
    fontSize: iconSizeDisplay, // Adjust the size as needed
    color: 'var(--roomatee-theme-color)', // Change the color to your desired color
  };

  return (
    <div >
      <SectionHeading title='Lease Term'/>
      <CalendarMonthIcon  style={iconStyle}/> {selectedCardDetails.leaseDurationInMonth} month
      </div>
  );
};

export default LeaseTerms;
