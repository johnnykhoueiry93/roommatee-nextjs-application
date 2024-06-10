"use client";

// import SelectListingType from "../modals/SelectListingType";
import React from "react";
import "../../styles/Listings.css";
import StaticFrontendLabel from "../../StaticFrontend";

import { useState } from "react";

const NoListingFound = () => {
  const [modalShow, setModalShow] = useState(false);
    
  return (
    <div className="container-fluid sadFace">
      <div>
        <img src={'/images/sadFace.png'} alt="Sad Emoji Face" />
        <h1>{StaticFrontendLabel.NO_LISTING_FOUND}</h1>
      </div>

      {/* <SelectListingType show={modalShow} onHide={() => setModalShow(false)} /> */}
    </div>
  );
};

export default NoListingFound;
