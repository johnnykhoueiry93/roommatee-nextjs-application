"use client";
import "../../styles/ListingType.css";
import { SiteData } from "../../context/SiteWrapper";
import Image from "next/image";

interface ListingBoxProps {
  onClickFunction: () => void;
  image: string;
  imageAlt: string;
  labelText: string;
  height: number;
  width: number;
}

const ListingBox: React.FC<ListingBoxProps> = ({ onClickFunction, image, imageAlt, labelText, height, width }) => {
  
  // @ts-ignore
  const {  isMobile } = SiteData()

  return (
    <div className="box" onClick={onClickFunction}>
      <Image className="listing-type-image" src={image} alt={imageAlt} height={height} width={width} />
      {isMobile ? <h6>{labelText}</h6> : <h4>{labelText}</h4>}
    </div>
  );
};

export default ListingBox;
