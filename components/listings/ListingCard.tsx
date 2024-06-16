"use client";

import React from "react";
import Card from "./Card";
import { useEffect, useState } from "react";
import CirculatorProgressLoader from "../loaders/CirculatorProgressLoader";

//@ts-ignore
const ListingCard = ({ listing }) => {


  function getColumnCountBasedOnDeviceType() {
    const screenWidth = window.innerWidth;
  
    if (screenWidth < 768) {
      // Mobile Phone
      return 2; // Return as a number
    } else if (screenWidth >= 768 && screenWidth < 1024) {
      // Tablet
      return 2; // Return as a number
    } else {
      // Laptop / Large screens
      return 3; // Return as a number
    }
  }

  // console.log('ListingCard.tsx: ' , listing);

  function returnLaptop() {
    return (
      <div className="container">
        {/* @ts-ignore */}
        {listing.map((rowListing, index) =>
          index % getColumnCountBasedOnDeviceType() === 0 ? (
            <div className="row row-listing" key={index / getColumnCountBasedOnDeviceType()}>
              {/* @ts-ignore */}
              {listing.slice(index, index + getColumnCountBasedOnDeviceType()).map((listingItem, innerIndex) => (
                <div className="col-12 col-md-6 col-lg-4" key={innerIndex}>
                  <Card listingItem={listingItem} index={index} listing={listing} />
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    );
  }

  function returnMobile() {
    return (
      <div className="container">
        {/* @ts-ignore */}
        {listing.map((rowListing, index) =>
          index % getColumnCountBasedOnDeviceType() === 0 ? (
            <div className="row row-listing" key={index / getColumnCountBasedOnDeviceType()}>
              {/* @ts-ignore */}
              {listing.slice(index, index + getColumnCountBasedOnDeviceType()).map((listingItem, innerIndex) => (
                <div className="col-12 col-md-6 col-lg-4" key={innerIndex}>
                  <Card listingItem={listingItem} index={index} listing={listing} />
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    );
  }

  const columnCount = getColumnCountBasedOnDeviceType();
  console.log('columnCount: ' + columnCount);
  return columnCount === 3 ? returnLaptop() : returnMobile();
};

export default ListingCard;
