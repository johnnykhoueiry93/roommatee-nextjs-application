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
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <div></div>; //TODO update to something better!!
  }

    return <div>User Profile</div>;
};

export default UserProfile;
