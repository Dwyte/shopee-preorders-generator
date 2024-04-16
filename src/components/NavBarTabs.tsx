import { Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const NavBarTabs = (props: { resetCurrentGeneratedList: () => void }) => {
  const handleChange = () => {
    props.resetCurrentGeneratedList();
  };

  const location = useLocation();
  console.log(location.pathname);
  return (
    <Tabs
      value={location.pathname}
      onChange={handleChange}
      variant="fullWidth"
      centered
    >
      <Tab
        component={Link}
        label="Generated Lists History"
        to="/history"
        value="/history"
      />
      <Tab
        component={Link}
        label="Generate New List"
        to="/newList"
        value="/newList"
      />
    </Tabs>
  );
};

export default NavBarTabs;
