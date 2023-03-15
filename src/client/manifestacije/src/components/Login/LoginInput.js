
import useInput from "../../hooks/use-input";
const LoginInput = () => {

    const {
        value: enteredName,
        isValid:enteredNameIsValid,
        hasError:nameInoputHasError,
        valueChangedHandler:nameChangedHandler,
        inputBlurHandler:nameBlurHandler,
        resetFunction:resetNameFunction
    } = useInput(value => value.trim() !== '');

    const {
        value: enteredEmail,
        isValid:enteredEmailIsValid,
        hasError:emailInputError,
        valueChangedHandler:emailChangedHandler,
        inputBlurHandler:emailBlurHandler,
        resetFunction:resetEmailNameFunction
    } = useInput(value => value.includes('@'));

    let formIsValid = false;
    if (enteredNameIsValid && enteredEmailIsValid){ //moze da se doda jos opcija koje se proveravaju
        // setFormIsValid(true);
        formIsValid=true;
    }
    else
    {
        // setFormIsValid(false);
        formIsValid=false;
    }

    const formSubmitionHandler = event => {
        event.preventDefault();
        if (!enteredNameIsValid || !enteredEmailIsValid){
            return;
        }
        console.log(enteredName);
        console.log(enteredEmail)

        resetNameFunction();
        resetEmailNameFunction();

    }

    const nameInputClasses = nameInoputHasError
        ? 'form-control invalid'
        : 'form-control'
    const emailInputClasses = emailInputError
        ? 'form-control invalid'
        : 'form-control'
    return (
        <form  className={"login-forma"} onSubmit={formSubmitionHandler}>
            <div className={"left-login-container"}>
                <div className={"login-label"}>
                    <label>Login</label>
                    <p>Don't have an account?<a href="">Create an account</a></p>
                </div>
                <div className={emailInputClasses}>
                    <label htmlFor='email'>E-mail</label>
                    <input type='email' id='email'
                           value={enteredEmail}
                           onChange={emailChangedHandler}
                           onBlur={emailBlurHandler}
                    />
                    {emailInputError && <label className={"error-text"}>Email Must not be empty!</label>}
                </div>
                <div className={nameInputClasses}>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password'
                           value={enteredName}
                           onChange={nameChangedHandler}
                           onBlur={nameBlurHandler}
                    />
                    {nameInoputHasError && <label className={"error-text"}>Password Must not be empty!</label>}
                    <label><a href="">Forgot your password?</a></label>
                </div>

                <div className="form-actions">
                    <button className={"login-button"} disabled={!formIsValid} >Login</button>
                </div>
            </div>
            <div className={"right-login-container"}>
                
            </div>
        </form>
    );
};

export default LoginInput;
