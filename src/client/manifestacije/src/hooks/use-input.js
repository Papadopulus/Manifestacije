import {useState} from "react";

const useInput = (validateValue ,initialValue='') => {
    // const [enteredValue, setEnteredValue] = useState('');
    const [enteredValue, setEnteredValue] = useState(initialValue);
    const [isTouched, setIsTouched] = useState(false);

   
    const valueIsValid = validateValue(enteredValue);
    const hasError = !valueIsValid && isTouched;


    const valueChangedHandler = event => {
        setEnteredValue(event.target.value);
    }
    const inputBlurHandler = () => {
        setIsTouched(true);
    }
    const resetFunction = () => {
        setEnteredValue('');
        setIsTouched(false)
    }

    return {
        value: enteredValue,
        isValid: valueIsValid,
        hasError,
        valueChangedHandler,
        inputBlurHandler,
        resetFunction
    };
}
export default useInput;