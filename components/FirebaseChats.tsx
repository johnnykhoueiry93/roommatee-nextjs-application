import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, or } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { SiteData } from "../context/SiteWrapper";

//@ts-ignore
const FirebaseChats = ({ userId }) => {
  //@ts-ignore
  const { firebaseToken  } = SiteData();

  const firebaseConfig = {
     apiKey: "AIzaSyBH2MsHlG4Irf5MipoaBk22qXI84hiHspM",
    authDomain: "roomateedev.firebaseapp.com",
    projectId: "roomateedev",
    storageBucket: "roomateedev.appspot.com",
    messagingSenderId: "578684800173",
    appId: "1:578684800173:web:0f84dbd3711723ccfb4a24",
    measurementId: "G-YKBEJ9JV0H",
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

    // Check if user is already signed in
    onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        // User not signed in, use the custom token to sign in
        signInWithCustomToken(auth, firebaseToken)
          .then((userCredential) => {
            const newUser = userCredential.user;
            console.log("User signed in:", newUser);
          })
          .catch((error) => {
            console.error("Error signing in:", error);
          });
      }
    });

    
  const chatsRef = collection(firestore, "chats");
  const filteredChatsQuery = query(
    chatsRef,
    or(where("firstPartyUserId", "==", userId), where("secondPartyUserId", "==", userId))
  );

  //@ts-ignore
  const useChats = () => useCollectionData(filteredChatsQuery, { idField: "id" });


  return { app, firestore, useChats, firebaseConfig };
};

export default FirebaseChats;
