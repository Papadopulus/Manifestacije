import './Introduction.css'
import React from "react";
import Typewriter from 'typewriter-effect';
const Introduction=()=>{
    const words = ['Koncert?', 'Festival?', 'Žurku?'];
    return(
        <div className={"background-div"}>
            <div className={"main-div"}>
                <div className={"header-text"}>
                    manifestacije
                </div>
                <div className={"body-text"}>
                    <span className={"space"}>Hoćemo na</span>
                    <Typewriter
                        options={{
                            strings: words,
                            autoStart: true,
                            loop: true,
                            deleteSpeed: 50,
                            pauseFor: 1000,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
export default Introduction;