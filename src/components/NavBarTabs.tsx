import { Tab, Tabs } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";

const NavBarTabs = () => {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Tabs value={location.pathname} variant="fullWidth" centered>
      <Tab
        component={Link}
        label="History"
        to="/history"
        value="/history"
        icon={<HistoryIcon />}
        iconPosition="start"
      />
      <Tab
        component={Link}
        label="Generate"
        to="/newList"
        value="/newList"
        icon={<AddIcon />}
        iconPosition="start"
      />
      <Tab
        component={Link}
        label="Settings"
        to="/settings"
        value="/settings"
        icon={<SettingsIcon />}
        iconPosition="start"
      />
    </Tabs>
  );
};

export default NavBarTabs;
