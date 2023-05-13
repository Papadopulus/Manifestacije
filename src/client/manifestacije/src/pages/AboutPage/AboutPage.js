import "./AboutPage.css";
import {Cursor} from "react-simple-typewriter";
const AboutPage = ()=>{
    return(
      <div className={"container-main"}>
          <div className={"container-first"}>
              <p>manifestacije</p>
              <p className={"container-text"}>nemoj posle da bude žal za propuštenim manifestacijama<Cursor /></p>
          </div>

          <div className={"container"}>
              <div className={"left-second"}>manifestacije portal omogućavaju lako
                  pronalaženje i učestvovanje u različitim kulturnim aktivnostima i na taj način bolje
                  upoznaju bogatu kulturu Srbije. Uz našu aplikaciju,
                  korisnici će uvek biti u toku sa najnovijim kulturnim događajima u Srbiji.
              </div>
              <div className={"right-second"}></div>
          </div>

          <div className={"container-third"}>
              <div className={"left-third"}></div>
              <div className={"right-third"}>Korisnici mogu pretraživati manifestacije
                  prema različitim kategorijama, poput grada, datuma, vrste događaja ili
                  interesa, što im omogućava da
                  pronađu ono što najviše odgovara njihovim potrebama i željama.</div>

          </div>

          <div className={"container"}>
              <div className={"left-fourth"}>Upoznaj hranu Srbije u najrazličitijim ukusima,
              muziku u najslušljivijim tonovima,
              prirodu u najšarenijim bojama.</div>
              <div className={"right-fourth"}></div>
          </div>
      </div>
    );
}
export default AboutPage;
