import useInput from "../../hooks/use-input";
import Input from "../UI/Input/Input";
import classes from "./ChangeProfile.module.css";
import Button from "../UI/Button/Button";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";

const ChangeProfile = (props) => {
  const {
    value: enteredName,
    isValid: enteredNameIsValid,
    hasError: nameInputHasError,
    valueChangedHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
    resetFunction: resetNameFunction,
  } = useInput((value) => value.trim() !== "",props.name);

  const {
    value: enteredSurname,
    isValid: enteredSurnameIsValid,
    hasError: surnameInputHasError,
    valueChangedHandler: surnameChangedHandler,
    inputBlurHandler: surnameBlurHandler,
    resetFunction: resetSurnameFunction,
  } = useInput((value) => value.trim() !== "",props.surname);

  let formIsValid = false;
  if (enteredNameIsValid && enteredSurnameIsValid) {
    formIsValid = true;
  } else {
    formIsValid = false;
  }
  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    if (!enteredNameIsValid || !enteredSurnameIsValid) {
      return;
    }
    let payload = {
      firstName: enteredName,
      lastName: enteredSurname,
    };
    await checkTokenAndRefresh();
    let header = {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("tokens")).token
      }`,
    };
    const response = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/users/${props.id}`,
      payload,
      { headers: header }
    );
    props.setUser(response.data);
    resetNameFunction();
    resetSurnameFunction();
  };
  return (
    <>
      <form onSubmit={formSubmissionHandler}>
        <p className={classes["main-text"]}>Izmeni profil</p>
        <Input
            label={"Novo ime"}
            type="text"
            id="name"
            value={enteredName}
            onChange={nameChangedHandler}
            onBlur={nameBlurHandler}
            isNotValid={nameInputHasError}
            className={classes["input-form"]}
        ></Input>
        {nameInputHasError && (
          <label className={classes["error-text"]}>Nevalidno ime!</label>
        )}
        <Input
          label={"Novo prezime"}
          type="text"
          id="surname"
          value={enteredSurname}
          onChange={surnameChangedHandler}
          onBlur={surnameBlurHandler}
          isNotValid={surnameInputHasError}
          className={classes["input-form"]}
        ></Input>
        {surnameInputHasError && (
          <label className={classes["error-text"]}>Nevalidno prezime!</label>
        )}
        <Button
          type={"submit"}
          className={classes["login-button"]}
          disabled={!formIsValid}
        >
          Izmeni
        </Button>
      </form>
    </>
  );
};
export default ChangeProfile;
