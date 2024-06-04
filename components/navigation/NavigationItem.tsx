"use client"
import React from "react";
// import { useNavigate } from "react-router-dom";

//@ts-ignore
const NavigationItem = ({ label, activeTab, handleTabClick, path, setSearchClick, children }) => {
  // let navigate = useNavigate();
  return (
    <li className="nav-item">
      <a
        className={`nav-link ${activeTab === label ? "active-tab" : "non-active-tab"}`}
        data-bs-toggle="collapse"
        data-bs-target=".navbar-collapse.show"
        onClick={() => {
          handleTabClick(label);
          // navigate(path);
          setSearchClick(false);
        }}
      >
        <span className="menu-item menu-item-hover">{children}</span>
      </a>
    </li>
  );
};

export default NavigationItem;
