import classes from "./AboutPage.module.css";
import { Cursor } from "react-simple-typewriter";
const AboutPage = () => {
  return (
    <div className={classes.containerMain}>
      <div className={classes.containerFirst}>
        <p>manifestacije</p>
        <p className={classes.containerText}>
          nemoj posle da bude žal za propuštenim manifestacijama
          <Cursor />
        </p>
      </div>

      <div className={classes.container}>
        <div className={classes.leftSecond}>
          manifestacije portal omogućavaju lako pronalaženje i učestvovanje u
          različitim kulturnim aktivnostima i na taj način bolje upoznavanje bogate
          kulture Srbije. Uz našu aplikaciju, korisnici će uvek biti u toku sa
          najnovijim kulturnim događajima u Srbiji.
        </div>
        <div className={classes.rightSecond}></div>
      </div>

      <div className={classes.containerThird}>
        <div className={classes.leftThird}></div>
        <div className={classes.rightThird}>
          Korisnici mogu pretraživati manifestacije prema različitim
          kategorijama, poput grada, datuma, vrste događaja ili interesa, što im
          omogućava da pronađu ono što najviše odgovara njihovim potrebama i
          željama.
        </div>
      </div>

      <div className={classes.container}>
        <div className={classes.leftFourth}>
          Upoznaj hranu Srbije u najrazličitijim ukusima, muziku u
          najslušljivijim tonovima, prirodu u najšarenijim bojama.
        </div>
        <div className={classes.rightFourth}></div>
      </div>
    </div>
  );
};
export default AboutPage;
