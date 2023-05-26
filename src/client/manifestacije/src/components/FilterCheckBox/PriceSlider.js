import React from "react";
import classes from "./PriceSlider.classes.css";
import Slider from "@material-ui/core/Slider";
function PriceSlider({ value, changePrice }) {
  return (
    <div className={classes["price-root"]}>
      <Slider
        value={value}
        onChange={changePrice}
        valueLabelDisplay="on"
        min={0}
        max={10000}
        classes={{
          thumb: classes["price-thumb"],
          rail: classes["price-rail"],
          track: classes["price-track"],
        }}
      />
    </div>
  );
}

export default PriceSlider;
