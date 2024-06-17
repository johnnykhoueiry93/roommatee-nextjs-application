import React from "react";

//@ts-ignore
const FeatureIconLabel = ({ icon, iconSize, label, fontSize }) => {

const aboutMeIconStyle = {
  fontSize: 35, 
  marginRight: "3px", 
  marginBottom: "10px",
  color: "#4CAF50",
};
    return (
      <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {icon && React.cloneElement(icon, { sx: { color: "var(--roomatee-theme-color);", fontSize: aboutMeIconStyle } })}
            <span style={{ marginLeft: "4px", fontSize: fontSize }}>{label}</span>
          </div>
      </div>
    );
  };
  
  export default FeatureIconLabel;