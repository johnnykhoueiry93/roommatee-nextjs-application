"use client"
import React from "react";
import { useRouter } from 'next/navigation';


//@ts-ignore
const NavigationItem = ({ label, activeTab, handleTabClick, path, setSearchClick, children }) => {
const router = useRouter();
const navigateToPage = (path) => {
  router.push(path);
};

  return (
    <li className="nav-item">
      <a
        className={`nav-link ${activeTab === label ? "active-tab" : "non-active-tab"}`}
        data-bs-toggle="collapse"
        data-bs-target=".navbar-collapse.show"
        onClick={() => {
          handleTabClick(label);
          navigateToPage(path);
          setSearchClick(false);
        }}
      >
        <span className="menu-item menu-item-hover">{children}</span>
      </a>
    </li>
  );
};

export default NavigationItem;
