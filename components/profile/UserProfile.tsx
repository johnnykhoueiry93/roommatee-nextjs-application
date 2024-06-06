"use client";
import React from "react";
import { useEffect, useState } from "react";
import { SiteData } from "../../context/SiteWrapper";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  //@ts-ignore
  const { userAuth } = SiteData();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const navigateToPage = (path) => {
    router.push(path);
  };

  useEffect(() => {
    if (!userAuth) {
      navigateToPage("/login");
    } else {
      console.log('The value of userAuth is: ' + userAuth);
    }
  }, []);

  // This logic checks the seesion if exits to authenticate. Good to have for server side rendering
  // useEffect(() => {
  //   async function checkSession() {
  //     const response = await fetch('/api/check-session');
  //     if (response.status === 401) {
  //       router.push('/login');
  //     }
  //   }

  //   checkSession();
  // }, [router]);


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div></div>; //TODO update to something better!!
  }

    return <div>User Profile</div>;
};

export default UserProfile;
