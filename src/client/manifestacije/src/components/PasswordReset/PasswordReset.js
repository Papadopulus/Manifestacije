import classes from "../Register/RegisterInput.module.css";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import useInput from "../../hooks/use-input";
import {useContext} from "react";
import AuthContext from "../../store/AuthContext";



/*Do ove forme se trenutno dolazi preko Forget password u loginu*/



const PasswordReset = () => {
    const {reset} = useContext(AuthContext);

    const {
        value: enteredPassword,
        isValid: enteredPasswordIsValid,
        hasError: passwordError,
        valueChangedHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        resetFunction: resetPasswordFunction,
    } = useInput((value) => value.trim() !== '');

    const {
        value: confirmPassword,
        isValid: confirmPasswordIsValid,
        hasError: confirmPasswordError,
        valueChangedHandler: confirmPasswordChangeHandler,
        inputBlurHandler: confirmPasswordBlurHandler,
        resetFunction: resetConfirmPasswordFunction,
    } = useInput((value) => value.trim() === enteredPassword);

    let resetNotValid;
    resetNotValid = !(enteredPasswordIsValid &&
        confirmPasswordIsValid);
    const resetSubmitHandler = async (event) => {
        event.preventDefault();
        if (!enteredPasswordIsValid ||
            !confirmPasswordIsValid) {
            return;
        }
        const payload = {
            password: enteredPassword
        }
        await reset(payload);
        resetConfirmPasswordFunction();
        resetPasswordFunction();
    }
    return(
        <form className={classes["reset-form"]} onSubmit={resetSubmitHandler}>
            <div className={classes["left-reset-container"]}>
                <h1></h1>
            </div>

            <div className={classes["right-reset-container"]}>
                <div className={classes["reset-handler"]}>
                    <div className={classes["icon"]}></div>
                    <h1 className={classes["main-sign"]}>Enter new password</h1>

                    <Input
                        label={"Password"}
                        type="password"
                        id="resetPassword"
                        value={enteredPassword}
                        onChange={passwordChangeHandler}
                        onBlur={passwordBlurHandler}
                        isNotValid={passwordError}
                    ></Input>
                    {passwordError && (
                        <label className={classes["error-text"]}>
                            Please enter a valid password!
                        </label>
                    )}

                    <Input
                        label={"Confirm password"}
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={confirmPasswordChangeHandler}
                        onBlur={confirmPasswordBlurHandler}
                        isNotValid={confirmPasswordError}
                    ></Input>
                    {confirmPasswordError && (
                        <label className={classes["error-text"]}>
                            The passwords don't match!
                        </label>
                    )}
                    <div className={classes["reset-button-div"]}>
                        <Button
                            type={"submit"}
                            className={classes["reset-button"]}
                            disabled={resetNotValid}>
                            Change your password</Button>
                    </div>
                </div>
            </div>
        </form>
    );
};
export default PasswordReset;