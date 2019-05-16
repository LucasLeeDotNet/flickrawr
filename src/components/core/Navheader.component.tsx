// React
import React from "react";

// Material
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Navheader = () => {
    return (
      <div className="header-container" >
        <AppBar position="static" color="default">
          <Toolbar className="toolbar">
            <Typography variant="h6" color="inherit"/>
          </Toolbar>
        </AppBar>
      </div>
    );
};

export default Navheader;
