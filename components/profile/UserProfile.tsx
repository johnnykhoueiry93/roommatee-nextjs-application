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
    }
  }, []);

  useEffect(() => {
    async function checkSession() {
      const response = await fetch('/api/check-session')
      if (response.status === 401) {
        router.push('/login')
      }
    }

    checkSession()
  }, [])


  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div></div>; //TODO update to something better!!
  }

  if (userAuth) {
    return <div>User Profile</div>;
  }
};

export default UserProfile;
