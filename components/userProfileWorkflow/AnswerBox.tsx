import "../../styles/userProfileWorkflow/AnswerBox.css";
import React from "react";

//@ts-ignore
const AnswerBox = ({ labelText, isActive, onClick }) => {
  return (
    <div className={`box ${isActive ? "active" : ""} `} onClick={onClick}>
      <span className='answer-box-label'>{labelText}</span>
    </div>
  );
};

export default AnswerBox;
