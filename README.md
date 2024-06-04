# Developer Notes
--------------------------------------------------------------------
UseContext is created to support sibling components and holding values across the lifecyle of the application
Some values upon a screen refresh will be stored in storage including userInfo, userAuth, profilePicture meaning if you reload the page they will not be lost until logout


# Use Context Main values
--------------------------------------------------------------------
userIsAdmin --> userIsAdmin() --> return true/false if the currently logged in user is admin or not
userAuth --> return true/false if the user is logged in or not
isMobile --> return true/false if the screen dimnentions is mobile
isTabletuserInfo --> return true/false if the screen dimnentions is tablet


# How to send frontend log to the backend
--------------------------------------------------------------------
step 1: import { logFrontendActivityToBackend } from '../frontendUtils/apiUtils'
Step 2: let message = 'whatever you want to send';
Step 3: logFrontendActivityToBackend( message, userInfo)


# How to use the frontend static labels and messages
--------------------------------------------------------------------
Step 1: import StaticFrontendLabel from "../StaticFrontend";
Step 2: const SETUP_PROFILE_MAX_ALLOWED_CITIES = StaticFrontendLabel.SETUP_PROFILE_MAX_ALLOWED_CITIES;


# Color
--------------------------------------------------------------------
Logo color: #4CAF50


# To change a component to match the color above
--------------------------------------------------------------------
1- Import App.css
2- Usage for example:  background-color: var(--roomatee-theme-color); //--roomatee-theme-color is in the APP.css

# Chat Exmaple with keyboard for mobile
--------------------------------------------------------------------
https://gist.github.com/MartijnHols/e9f4f787efa9190885a708468f63c5bb#file-useonscreenkeyboardscrollfix-ts

# Icons
https://mui.com/material-ui/material-icons/

# Fonts
https://www.fontsmarket.com/font-details/engravers-gothic-bt

# Random user profile pics
https://xsgames.co/randomusers/avatar.php?g=male

# Email functionality using: Brevo API 
https://github.com/getbrevo/brevo-node
API Key is in the .env file under src/backend

# Services Used
- Google map
- Brevo API (send email)
- Firebase
- AWS S3
- MySQL database on cloud cluster


# Webserivces Migrated
/api/login
/getUserListings

# Webserivces Pening Migration
/getUsers
/posts
/getS3PictureUrl
/resendVerificationToken
/signup
/uploadMultiple
/updateRoomListing
/handleUploadPictureToS3SubFolder
/createNewRoomListing
/createUserProfile
/changePassword
/resetPassword
/setMysqlDatabaseFlagTrue
/verifyCode
/createTicket
/sendTicketReply
/reportUserChat
/getUserSupportTickets
/getTicketDetails
/updateSocialMediaLinks
/insertProfileSetupInfo
/getUserCounts
/getUserProfileCounts
/logInitialMessageSent
/logFrontendActivity
/searchProfile
/search
/searchListingById
/searchTenantById