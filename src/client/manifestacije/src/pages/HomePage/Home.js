import MainPageFilter from "../../components/FilterCheckBox/MainPageFilter";
import classes from "./Home.module.css";

const Home = () => {
  return (
    <div className={classes["home-container"]}>
      <div className={classes["left-containter-home"]}>
        <MainPageFilter></MainPageFilter>
      </div>
      <div className={classes["right-containter-home"]}>
        EVENTS COMMING SOON >..........>
      </div>
    </div>
  );
};
export default Home;
