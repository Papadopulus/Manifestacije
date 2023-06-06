import React, {useEffect, useState} from "react";
import classes from "../BackToTopButton/BackToTopButton.module.css"
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const BackToTopButton = () => {
    const [backToTopButton, setBackToTopButton] = useState(false)

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                setBackToTopButton(true);
            } else {
                setBackToTopButton(false);
            }

        })
    }, [])
    const scrollUp = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    return (
        <>
            {backToTopButton && (
                <div className={classes.scrollTop}>
                    <ArrowUpwardIcon onClick={scrollUp}>UP</ArrowUpwardIcon>
                </div>
            )}
        </>
    );
}
export default BackToTopButton;