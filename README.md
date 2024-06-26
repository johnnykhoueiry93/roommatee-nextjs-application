# Developer Notes
--------------------------------------------------------------------
UseContext is created to support sibling components and holding values across the lifecyle of the application
Some values upon a screen refresh will be stored in storage including userInfo, userAuth, profilePicture meaning if you reload the page they will not be lost until logout

# How to Build Production
--------------------------------------------------------------------
1- npm run build
2- The run build will zip the .next folder to next.js folder which you can reveal in Explorer
3- Zip the public to public.zip
4- Scp next.zip to the /home/administrator
5- Scp public.zip to the /home/administrator
6- Login to the Linux server

cd /root/app/nextjs
rm -rf .next/
mv /home/administrator/next.zip .
unzip next.zip
npm run start

# Use Context Main values
--------------------------------------------------------------------
userIsAdmin --> userIsAdmin() --> return true/false if the currently logged in user is admin or not
userAuth --> return true/false if the user is logged in or not
isMobile --> return true/false if the screen dimnentions is mobile
isTabletuserInfo --> return true/false if the screen dimnentions is tablet

# How to navigate to another page
--------------------------------------------------------------------
import { useRouter } from 'next/navigation';
const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};
navigateToPage('/new page');


# How to send frontend log to the backend
--------------------------------------------------------------------
step 1: import { logFrontendActivityToBackend } from '../../utils/apiUtils'
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
/login
/signup
/getUserListings
/updateRoomListing
/changePassword
/resetPassword
/verifyCode
/getS3PictureUrl
/resendVerificationToken
/handleUploadPictureToS3SubFolder
/logFrontendActivity
/createNewRoomListing
/createUserProfile
/uploadMultiple
/search
/searchProfile
/searchListingById
/searchTenantById
/logInitialMessageSent
/setMysqlDatabaseFlagTrue
/sendTicketReply
/updateSocialMediaLinks
/insertProfileSetupInfo
/getUserSupportTickets
/getTicketDetails
/createTicket
/reportUserChat
/getUserCounts
/getUserProfileCounts

# Webserivces Pening Migration
/getUsers
/posts

