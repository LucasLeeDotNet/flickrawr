// React
import React, { useContext } from "react";

// State
import { StoreContext } from "../../../context/StoreContext";

// Material
import { AppBar, LinearProgress, Toolbar, Typography } from "@material-ui/core";

const NavHeader = () => {
  const {state} = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  return (
    <div className="NavHeader" >
      <AppBar position="static" color="default">
        <Toolbar className="toolbar">
          <img src="./logo.png" width="100" />
          <div className="NavHeader-title">
            {"flick{{rawr!}}"}
            <span className="NavHeader-subtitle">flickr but louder</span>
          </div>
        </Toolbar>
      </AppBar>
      { isLoading ? <LinearProgress />
      :
        undefined
      }
    </div>
  );
};

export default NavHeader;
