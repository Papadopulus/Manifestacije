import "./AboutPage.css";
import {Cursor} from "react-simple-typewriter";
const AboutPage = ()=>{
    return(
      <div className={"container-main"}>
          <div className={"container-first"}>
              <p>manifestacije</p>
              <p className={"container-text"}>otkrij kulturu Srbije kroz manifestacije<Cursor /></p>
          </div>

          <div className={"container"}>
              <div className={"left-second"}></div>
              <div className={"right-second"}></div>
          </div>

          <div className={"container-third"}>
              <div className={"left-third"}></div>
              <div className={"right-third"}></div>

          </div>

          <div className={"container"}>
              <div className={"left-fourth"}></div>
              <div className={"right-fourth"}></div>
          </div>
      </div>
    );
}
export default AboutPage;
