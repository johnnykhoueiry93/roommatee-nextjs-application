/**
 * How to use the frontend static labels and messages
 * Step 1: import StaticFrontendLabel from "../StaticFrontend";
 * Step 2: const SETUP_PROFILE_MAX_ALLOWED_CITIES = StaticFrontendLabel.SETUP_PROFILE_MAX_ALLOWED_CITIES;
 */


 const StaticFrontendLabel = {
    APPLICATION_VERSION: 'A.0.1.17 05-04-2024 8:36PM',
    APPLICATION_NAME: 'Roomatee',
    APPLICATION_CONTACT_INFO: '',
    APPLICATION_COMPANY_DESCRIPTION: 'company description',
    APPLICATION_COMPANY_ADDRESS: 'company address',
    APPLICATION_COMPANY_EMAIL: 'company@email.com',
    APPLICATION_COMPANY_TELEPHONE: '+001 34926290462',
    MY_PROFILE_PROFILE_PICTURE_TEXT: ' Let\'s make sure your future roomie knows they\'re getting the coolest companion around.',
    CHAT_REPORT_USER_SUCCESS_MESSAGE: 'The user was reported. We will contact the user and inform you of the final outcome',
    LIST_A_ROOM_PAGE_TITLE: 'List a Place',
    USER_INACTIVITY_TIMER: 6, // after X the user will be prompted with popup to stay signed in or sign out

    PRIVACY_MESSAGE_PHONE_NUMBER: 'We respect your privacy and will never share your phone number. The number is private and you\'re in control to set it to public/private.',

    AUTOCOMPLETE_SEARCH_MAX_LENGTH: 70,

    SETUP_PROFILE_MAX_ALLOWED_CITIES: 3,
    USER_PROFILE_BIO_MAX_LENGTH: 300,
    SOCIAL_MEDIA_URL_MAX_LENGTH: 200,
    NEW_LISTING_HOUSING_DESCRIPTION_MAX_LENGTH: 300,
    NEW_CHAT_MESSAGE_MAX_LENGTH: 300,
    RESEND_BUTTON_TIMER_DELAY: 180,
    
    NO_LISTING_FOUND: 'Sorry, you have not created any listings yet',
    VERIFICATION_REASON_TEXT: 'Verification builds trust between users and the platform. Users are more likely to trust an environment where they know that other users have undergone a verification process.',
    VERIFICATION_POST_COMPLETION_RESULT: 'Once completed, a verification check will be applied to all your listings, adding an extra layer of trust and credibility to your account',
    ERR_PASSWORD_DO_NOT_MATCH: 'Passwords do not match!',
    SUPPORT_EMAIL_ADDRESS : 'admin@roomatee.com',
    GOOGLE_MAP_API_KEY: 'AIzaSyDVf4c1yhgm13uPchaanOfjF88n4G1udaI',
    MAX_ALLOWED_BACKEND_CALLS_PER_MINUTE: 10,
    GENDER_LIST: ['Male','Female', 'Transgender', 'X', 'Prefer not to Say'],
    HOUSING_TYPE_LIST:  ["Apartment", "Bedroom", "Studio", "House", "Any"],
    LANGUAGES_LIST:  [
        'English',
        'Chinese',
        'Spanish',
        'French',
        'Arabic',
        'Hindi',
        'Russian',
        'Portuguese',
        'Bengali',
        'German',
        'Japanese',
        'Swahili',
        'Korean',
        'Italian',
        'Turkish',
        'Tamil',
        'Urdu',
        'Punjabi',
        'Telugu',
        'Marathi',
        'Vietnamese',
        'Javanese',
        'Gujarati',
        'Persian',
        'Polish',
        'Malay',
        'Pashto',
        'Kannada',
      ],
}

export default StaticFrontendLabel;