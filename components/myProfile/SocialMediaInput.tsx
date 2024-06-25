import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StaticFrontendLabel from "../../StaticFrontend";
import { SiteData } from "../../context/SiteWrapper";

//@ts-ignore
const SocialMediaInput = ({ welcomeProfileSetupStep, setWelcomeProfileSetupStep, field, label }) => {
    let SOCIAL_MEDIA_URL_MAX_LENGTH = StaticFrontendLabel.SOCIAL_MEDIA_URL_MAX_LENGTH;
  // @ts-ignore
  const { isMobile } = SiteData();
  const INSTAGRAM_ICON = "/images/instagram-icon.png";
  const FACEBOOK_ICON = "/images/facebook-icon.png";
  const TWITTER_ICON = "/images/twitterx-icon.png";
  
    const socialIconStyle = {
        ...(isMobile
          ? { height: "35px", width: "35px" }
          : { height: "40px", width: "40px" }),
        marginRight: "9px",
        marginTop: "7px"
      };


    //@ts-ignore
    function returnIcon(label) {
        if(label == 'Twitter') {
            return <img
            src={TWITTER_ICON}
            style={socialIconStyle}
            alt="Profile Verified"
          />

        } else if(label == 'Facebook') {
            return <img
            src={FACEBOOK_ICON}
            style={socialIconStyle}
            alt="Profile Verified"
          />

        } if(label == 'Instagram') {
            return <img
            src={INSTAGRAM_ICON}
            style={socialIconStyle}
            alt="Profile Verified"
          />
        } 
    }

    //@ts-ignore
    function prependAtIfNeeded(value) {
      if (!value || value.trim() === "") {
        return "@";
      } else {
        return value;
      }
    }

  return (
      
    <div style={{ display: "flex"}}>
        
    {returnIcon(label)}

    <div className="form-floating mb-3 input-field-width">
    <FormControl sx={{ width: "100%" }} variant="outlined">
        <InputLabel htmlFor={field}>{label}</InputLabel>
        <OutlinedInput
          id={field}
          type="txt"
          label={label}
          value={prependAtIfNeeded(welcomeProfileSetupStep[field])} // prepend @ if needed
          onChange={(e) =>
            setWelcomeProfileSetupStep({
              ...welcomeProfileSetupStep,
              [field]: e.target.value,
            })
          }
          inputProps={{ maxLength: SOCIAL_MEDIA_URL_MAX_LENGTH }}
        />
      </FormControl>
    </div>
    <DeleteOutlineIcon className='mt-3 ml-1 cursor-pointer' onClick={() => {setWelcomeProfileSetupStep({ ...welcomeProfileSetupStep, [field]: '' })}}/>
  </div>
  );
};

export default SocialMediaInput;
