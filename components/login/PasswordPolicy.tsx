import React, { useEffect } from 'react';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import '../../styles/PasswordPolicy.css'

//@ts-ignore
const PasswordPolicy = ({ password, onValidationChange }) => {
  const passwordIsMinimum8CharactersLength = () => {
    return password.length >= 8;
  };

  const passwordHasNumber = () => {
    return /\d/.test(password);
  };

  const passwordHasSymbolCharacter = () => {
    return /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
  };

  const passwordVerificationIconStyle = {
    fontSize: 20, // Adjust the size as needed
    color: "var(--roomatee-theme-color)", // Change the color to your desired color
  };

  useEffect(() => {
    const isValid =
      passwordIsMinimum8CharactersLength() &&
      passwordHasNumber() &&
      passwordHasSymbolCharacter();

    // Pass the result back to the parent component
    onValidationChange(isValid);
  }, [password, onValidationChange]);

  return (
    <div>
      <div className="ml-2">
        <p className='password-policy-general'>
          {passwordIsMinimum8CharactersLength() ? (
            <CheckCircleIcon style={passwordVerificationIconStyle} />
          ) : (
            <RadioButtonUncheckedIcon style={passwordVerificationIconStyle} />
          )}{" "}
          <span className={passwordIsMinimum8CharactersLength() ? 'policy-satisfied' : 'policy-not-satisfied'}>Password is 8 characters min length</span>
        </p>
        <p className='password-policy-general'>
          {passwordHasNumber() ? (
            <CheckCircleIcon style={passwordVerificationIconStyle} />
          ) : (
            <RadioButtonUncheckedIcon style={passwordVerificationIconStyle} />
          )}{" "}
          <span className={passwordHasNumber() ? 'policy-satisfied' : 'policy-not-satisfied'}>Password has a number</span>
        </p>
        <p className='password-policy-general'>
          {passwordHasSymbolCharacter() ? (
            <CheckCircleIcon style={passwordVerificationIconStyle} />
          ) : (
            <RadioButtonUncheckedIcon style={passwordVerificationIconStyle} />
          )}{" "}
          <span className={passwordHasSymbolCharacter() ? 'policy-satisfied' : 'policy-not-satisfied'}>Password has a symbol</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordPolicy;
