import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

const NavBarTabs = (props: { resetCurrentGeneratedList: () => void }) => {
  const [value, setValue] = useState(1);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    props.resetCurrentGeneratedList();
  };

  return (
    <Tabs value={value} onChange={handleChange} variant="fullWidth" centered>
      <Tab component={Link} label="Generated Lists History" to="/history" />
      <Tab component={Link} label="Generate New List" to="/newList" />
    </Tabs>
  );
};

export default NavBarTabs;
