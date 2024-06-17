import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import ChairIcon from '@mui/icons-material/Chair';
import TvIcon from '@mui/icons-material/Tv';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import HeatPumpIcon from '@mui/icons-material/HeatPump';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import FlatwareIcon from '@mui/icons-material/Flatware';
import CoffeeMakerIcon from '@mui/icons-material/CoffeeMaker';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import WifiPasswordIcon from "@mui/icons-material/WifiPassword";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import KitchenIcon from "@mui/icons-material/Kitchen";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import PetsIcon from "@mui/icons-material/Pets";
import ShowerIcon from "@mui/icons-material/Shower";
import FeatureIconLabel from './FeatureIconLabel';
import '../../styles/AccomodationsSection.css'
import { SiteData } from "../../context/SiteWrapper";
import SectionHeading from '../modals/SectionTitle';

//@ts-ignore
const AccomodationsSection = ({selectedCardDetails}) => {

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

    /**
     * We are creating an array that takes the available accomodations
     * name: will be the label
     * icon: is the Icon picture
     * included is an indicator if this accomodation is true/false (if false we do not show it)
     */
    const featureData = [
        { name: "Private Bathroom", icon: <ShowerIcon />, included: convertToBoolean(selectedCardDetails.privateBathroom) },
        { name: "Internet Connection", icon: <WifiPasswordIcon />, included: convertToBoolean(selectedCardDetails.internetConnection) },
        { name: "Washer", icon: <LocalLaundryServiceIcon /> , included: convertToBoolean(selectedCardDetails.washer)},
        { name: "Dish Washer", icon: <LocalLaundryServiceIcon /> , included: convertToBoolean(selectedCardDetails.dishWasher)},
        { name: "Microwave", icon: <MicrowaveIcon />, included: convertToBoolean(selectedCardDetails.microwave) },
        { name: "Refrigerator", icon: <KitchenIcon /> , included: convertToBoolean(selectedCardDetails.refrigerator)},
        { name: "Pet Friendly", icon: <PetsIcon />, included: convertToBoolean(selectedCardDetails.petFriendly) },
        { name: "Smoking Allowed", icon: <SmokingRoomsIcon />, included: convertToBoolean(selectedCardDetails.smokingAllowed) },
        { name: "Furnished", icon: <ChairIcon />, included: convertToBoolean(selectedCardDetails.furnished) },
        { name: "Television", icon: <TvIcon />, included: convertToBoolean(selectedCardDetails.television) },
        { name: "Air Conditioning", icon: <AcUnitIcon />, included: convertToBoolean(selectedCardDetails.airConditionning) },
        { name: "Heating", icon: <HeatPumpIcon /> , included: convertToBoolean(selectedCardDetails.heating)},
        { name: "Dryer", icon: <LocalLaundryServiceIcon /> , included: convertToBoolean(selectedCardDetails.dryer)},
        { name: "Fireplace", icon: <FireplaceIcon />, included: convertToBoolean(selectedCardDetails.fireplace) },
        { name: "Smoke Alarm", icon: <NotificationImportantIcon /> , included: convertToBoolean(selectedCardDetails.smokeAlarm)},
        { name: "Dishes and Silverware", icon: <FlatwareIcon /> , included: convertToBoolean(selectedCardDetails.dishes)},
        { name: "Toaster", icon: <BreakfastDiningIcon />, included: convertToBoolean(selectedCardDetails.toaster) },
        { name: "Coffee Maker", icon: <CoffeeMakerIcon />, included: convertToBoolean(selectedCardDetails.coffeeMaker) },
      ];

    return (
      <>
        <SectionHeading title='Accomodation Includes'/>
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
    );
}

export default AccomodationsSection;