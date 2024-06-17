import FeatureIconLabel from "./FeatureIconLabel";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { SiteData } from "../../context/SiteWrapper";
import SectionHeading from '../modals/SectionTitle';

//@ts-ignore
const AccessibilityPerks = ({selectedCardDetails}) => {
  //@ts-ignore
  const { isMobile } = SiteData();

  let iconSizeDisplay="2rem";
  let fontSize="18px";

  if (isMobile) {
    iconSizeDisplay="2.1rem";
    fontSize="15px";
  }


    //@ts-ignore
    const convertToBoolean = (value) => {
        return value == 1 ? true : false;
      };

      const featureData = [
        { name: "Wheel Chair Accessibility", icon: <AccessibleIcon />, included: convertToBoolean(selectedCardDetails.wheelChairAccessibility) },
        { name: "Private Parking", icon: <LocalParkingIcon />, included: convertToBoolean(selectedCardDetails.privateParking) },
        { name: "Public Parking", icon: <LocalParkingIcon /> , included: convertToBoolean(selectedCardDetails.publicParking)},
      ];

    return (
<>
<SectionHeading title='Accessibility Perks'/>
        {/* An array that's going to loop across all the acoomodations dynamically
and create them on 2 columns and spread them evenly
only when the included is true
 */}
        <div className="row">
          {featureData.map(
            (feature, index) =>
              feature.included && (
                <div className="col-6" key={index}>
                  <FeatureIconLabel
                    icon={feature.icon}
                    iconSize={iconSizeDisplay}
                    label={feature.name}
                    fontSize={fontSize}
                  />
                </div>
              )
          )}
        </div>
</>

    )
}

export default AccessibilityPerks;