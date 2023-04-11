import './Introduction.css'
import React from "react";
import { useTypewriter, Cursor } from 'react-simple-typewriter';
const Introduction=()=>{
    const {text}=useTypewriter({
        words:['Festival','Koncert','Žurku'],
        loop:{},
        typeSpeed: 120
    })
    return(
        <div className={"background-div"}>
            <div className={"main-div"}>
                <div className={"header-text"}>
                    manifestacije
                    <span>{text}</span>
                    <Cursor></Cursor>
                </div>
                <div className={"body-text"}>
                    Dobrodošli na najuzbudljiviji portal o dešavanjima u Srbiji!
                    Ovde ćete pronaći sve što vam je potrebno za uživanje u najboljim događajima u zemlji.
                    Bilo da ste ljubitelj muzike, hrane, sporta ili kulture, imamo za svakoga ponešto.
                    Pripremite se za zabavu, upoznavanje novih ljudi i stvaranje uspomena koje će trajati ceo život.
                    Dobrodošli u svet manifestacija u Srbiji!
                </div>
            </div>
        </div>
    );
}
export default Introduction;