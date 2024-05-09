import { Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const NavBarTabs = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Tabs value={location.pathname} variant="fullWidth" centered>
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
      <Tab component={Link} label="Settings" to="/settings" value="/settings" />
    </Tabs>
  );
};

export default NavBarTabs;
