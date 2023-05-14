import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
import classes from "./CheckBoxStyle.module.css";
import "./Checkbox.css";
const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);
  //U Checked ce se nalaziti indeksi cekiranih polja
  const handleCheck = (value) => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
    //update this checked information into Parent Component
  };
  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <div className={classes["dropdown-options"]}>
          <Checkbox
            onChange={() => handleCheck(value.id)}
            type="checkbox"
            checked={Checked.indexOf(value.id) !== -1}
          />
          &nbsp;&nbsp;
          <span className={classes["dropdown-name"]}>{value.name}</span>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      </React.Fragment>
    ));
  return (
    <div>
      <Collapse
        defaultActiveKey={["0"]}
        className={classes["home-filter-panel"]}
      >
        <Panel
          header={props.name}
          key="1"
          className={classes["home-filter-panel-name"]}
        >
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
