import "../../styles/ListingType.css";
import { SiteData } from "../../context/SiteWrapper";

//@ts-ignore
const ListingBox = ({ onClickFunction, image, imageAlt, labelText, height, width }) => {
  // @ts-ignore
  const {  isMobile } = SiteData()
  
  return (
    <div className="box" onClick={onClickFunction}>
      {image && <img src={image} className="listing-type-image" alt={imageAlt} height={height} width={width}/>}
      {isMobile ? (
        <h6>{labelText}</h6>
      ) : (
        <h3>{labelText}</h3>
      )}
    </div>
  );
};

export default ListingBox;
