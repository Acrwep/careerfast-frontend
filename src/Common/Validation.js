const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const orgNameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const officialEmailRegex =
  /^[a-zA-Z0-9._%+-]+@(?!(gmail\.com$))[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
const pincodeRegex = /^[A-Za-z0-9\s\-]{3,10}$/;

export const nameValidator = (name) => {
  let error = "";
  if (!name || name.length <= 0) error = " is required ";
  else if (!nameRegex.test(name) || name.length < 3) error = " is not valid ";
  return error;
};

export const orgTypeValidation = (orgType) => {
  if (!orgType || orgType.length <= 0) {
    return " is required ";
  } else {
    return "";
  }
};

export const orgNameValidation = (orgName) => {
  let error = "";
  if (!orgName || orgName.length <= 0) error = " is required ";
  else if (!orgNameRegex.test(orgName) || orgName.length < 3)
    error = " is not valid ";
  return error;
};

export const phoneValidation = (number) => {
  let error = "";
  if (!number || number.trim() === "") return " is required.";
  if (!phoneRegex.test(number)) return " must be in 10-digit.";
  return error;
};

export const emailValidator = (email) => {
  let error = "";
  if (!email || email.trim() === "") return " is required.";
  if (!emailRegex.test(email)) return " is not valid";
  return error;
};

export const officialEmailValidator = (officialEmail) => {
  let error = "";
  if (!officialEmail || officialEmail.trim() === "") return " is required.";
  if (!officialEmailRegex.test(officialEmail)) return " is not valid";
  return error;
};

export const passwordValidator = (password) => {
  let error = "";
  if (!password || password.trim() === "") return " is required.";
  if (!passwordRegex.test(password))
    return " must be at least 6 characters, including a letter and a number.";
  return error;
};

export const confirmPasswordValidation = (password, confirmPassword) => {
  let error = "";
  if (!confirmPassword || confirmPassword.trim() === "") {
    return " is required.";
  }
  if (password !== confirmPassword) {
    return " do not match.";
  }
  return error;
};

export const pincodeValidator = (pincode) => {
  let error = "";
  if (!pincode || pincode.length <= 0) error = " is required ";
  else if (!pincodeRegex.test(pincode) || pincode.length < 3)
    error = " is not valid ";
  return error;
};

export const selectValidator = (selectValue) => {
  if (!selectValue || selectValue.length <= 0) {
    return " is required ";
  } else {
    return "";
  }
};

export const genderValidator = (genderValue) => {
  if (!genderValue || genderValue.trim().length === 0) {
    return "Gender is required.";
  }
  return "";
};

export const userTypeValidator = (userTypeValue) => {
  if (!userTypeValue || userTypeValue.trim().length === 0) {
    return "User type is required.";
  }
  return "";
};
